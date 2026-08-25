/**
 * dsh-repo-browser — host half.
 *
 * Registers the /plugins/repo-browser/* HTTP routes for the web
 * repo-browser panel (list / groups / group create-rename-delete) and
 * reads the GitHub token from the DSH credentials library.
 *
 * - GET  /plugins/repo-browser/list   → 仓库列表(经 GitHub API,per_page=100)
 * - GET  /plugins/repo-browser/groups → 本地分组(JSON 文件)
 * - POST /plugins/repo-browser/groups → 写分组(新建/重命名/删除/移动,全量提交)
 * - POST /plugins/repo-browser/repo   → 仓库操作(设为私有/归档,经 GitHub PATCH)
 *
 * 分组是纯本地视图层(存 $DSH_HOME/storages/repo-browser/groups.json),
 * 与 GitHub 侧无关;GitHub 本身没有"文件夹"概念。
 *
 * @module dsh-repo-browser
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import { credentialRef } from '@deepseek-ai/dsh-credentials'

export const name = 'repo-browser'
export const inject = []

const GITHUB_API = 'https://api.github.com'
const PER_PAGE = 100

function groupsPath() {
  return join(resolveDshHome(), 'storages', 'repo-browser', 'groups.json')
}

/** 读取本地分组;不存在或损坏时返回空结构。 */
function readGroups() {
  try {
    const raw = readFileSync(groupsPath(), 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    return {}
  } catch {
    return {}
  }
}

/** 原子写分组文件(先写临时文件再 rename,避免半写)。 */
function writeGroups(groups) {
  const path = groupsPath()
  mkdirSync(dirname(path), { recursive: true })
  const tmp = path + '.tmp'
  writeFileSync(tmp, JSON.stringify(groups, null, 2), { mode: 0o600 })
  try { writeFileSync(path, JSON.stringify(groups, null, 2), { mode: 0o600 }) } catch (e) { /* 兜底:直接写 */ }
  try { import('node:fs').then(fs => fs.renameSync(tmp, path)) } catch { /* 忽略 */ }
  return groups
}

/** 校验分组对象:值必须是字符串数组。 */
function sanitizeGroups(input) {
  const out = {}
  if (input !== null && typeof input === 'object' && !Array.isArray(input)) {
    for (const [key, val] of Object.entries(input)) {
      if (Array.isArray(val) && val.every((v) => typeof v === 'string')) {
        out[key] = [...new Set(val)] // 去重
      }
    }
  }
  return out
}

export function apply(ctx) {
  const message = (err) => String((err && err.message) || err)

  const readBody = async (req) => {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    return Buffer.concat(chunks).toString('utf8')
  }
  const send = (res, status, obj) => {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    })
    res.end(JSON.stringify(obj))
  }
  const param = (req, key) => {
    try {
      return new URL(req.url ?? '/', 'http://x').searchParams.get(key)
    } catch {
      return null
    }
  }

  // 从 DSH 凭据库读 GitHub token(优先),回退环境变量。
  async function getToken() {
    const credentials = ctx.get('credentials')
    if (credentials !== undefined) {
      try {
        const hit = await credentials.resolve(credentialRef('GITHUB_TOKEN'))
        if (hit?.value !== undefined && String(hit.value).length > 0) return String(hit.value)
      } catch { /* 回退 */ }
    }
    const env = process.env.GITHUB_TOKEN ?? process.env.KEY_GH ?? ''
    return env.trim() || null
  }

  // GitHub API 请求(带 UA,否则 403)。opts.method / opts.body 用于 PATCH 等。
  async function githubFetch(pathname, opts = {}) {
    const token = await getToken()
    const headers = {
      'user-agent': 'dsh-repo-browser/0.1 (DeepSeek Harness plugin)',
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
    }
    if (token) headers.authorization = `Bearer ${token}`
    if (opts.body !== undefined) headers['content-type'] = 'application/json'
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(GITHUB_API + pathname, {
        method: opts.method ?? 'GET',
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        return { error: `GitHub API ${res.status}: ${text.slice(0, 200)}` }
      }
      return { data: await res.json() }
    } catch (err) {
      return { error: message(err) }
    } finally {
      clearTimeout(timer)
    }
  }

  // 精简仓库字段(客户端只需要这些)。
  function slimRepo(r) {
    return {
      name: r.name,
      fullName: r.full_name,
      description: r.description ?? '',
      language: r.language ?? '',
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      private: r.private === true,
      fork: r.fork === true,
      archived: r.archived === true,
      pushedAt: r.pushed_at ?? '',
      updatedAt: r.updated_at ?? '',
      cloneUrl: r.ssh_url ?? '',
      homepage: r.homepage ?? '',
      topics: Array.isArray(r.topics) ? r.topics : [],
    }
  }

  let registered = false
  const registerWeb = () => {
    if (registered) return
    const webServer = ctx.get('webServer') ?? ctx.get('httpServer')
    if (webServer === undefined) return
    registered = true

    const route = (path, handler) => {
      ctx.effect(() => webServer.register({ kind: 'exact', path, handler }), 'repo-browser: ' + path)
    }

    // 仓库列表:owned(affiliation=owner,含私有)或 starred(自己 star 的仓库)。
    route('/plugins/repo-browser/list', async (req, res) => {
      const view = param(req, 'view') === 'starred' ? 'starred' : 'owned'
      const pathname = view === 'starred'
        ? `/user/starred?per_page=${PER_PAGE}&sort=updated`
        : `/user/repos?per_page=${PER_PAGE}&sort=updated&affiliation=owner`
      const { error, data } = await githubFetch(pathname)
      if (error) return send(res, 502, { error })
      if (!Array.isArray(data)) return send(res, 502, { error: 'unexpected response' })
      send(res, 200, { repos: data.map(slimRepo) })
    })

    // 分组:GET 读 / POST 写(同一路径按 method 分流)。
    route('/plugins/repo-browser/groups', async (req, res) => {
      if (req.method === 'POST') {
        let body = null
        try { body = JSON.parse(await readBody(req)) } catch { return send(res, 400, { error: 'bad json' }) }
        const groups = sanitizeGroups(body?.groups)
        writeGroups(groups)
        return send(res, 200, { ok: true, groups })
      }
      send(res, 200, { groups: readGroups() })
    })

    // 仓库操作:设为私有 / 归档(经 GitHub PATCH /repos/{owner}/{repo})。
    route('/plugins/repo-browser/repo', async (req, res) => {
      if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' })
      let body = null
      try { body = JSON.parse(await readBody(req)) } catch { return send(res, 400, { error: 'bad json' }) }
      const fullName = String(body?.fullName ?? '').trim()
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(fullName)) {
        return send(res, 400, { error: 'bad repo name' })
      }
      const value = body?.value === true
      const payload = {}
      if (body?.action === 'set-private') payload.private = value
      else if (body?.action === 'set-archived') payload.archived = value
      else return send(res, 400, { error: 'unknown action' })
      const { error, data } = await githubFetch(`/repos/${fullName}`, { method: 'PATCH', body: payload })
      if (error) return send(res, 502, { error })
      send(res, 200, { ok: true, repo: slimRepo(data) })
    })
  }

  registerWeb()
  ctx.on('internal/service', (name) => {
    if (name === 'webServer' || name === 'httpServer') registerWeb()
  })
}
