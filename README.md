# dsh-repo-browser

> **Repository Browser for DeepSeek Harness** — a right-side resizable panel listing your GitHub repositories with local grouping and quick actions (move-to-group / make private / archive). Install: `dsh plugin --profile web add dsh-repo-browser`.

DeepSeek Harness 的 GitHub 仓库浏览器插件：标题栏提供 GitHub 猫头按钮，点击在页面**右侧**打开可调宽度的仓库列表面板。

## 功能

- **仓库列表**：经 GitHub API 拉取（`/user/repos?affiliation=owner`，含私有仓库），卡片显示名称、描述、语言、星标、fork、最后推送、**topics**、私有/归档标记
- **本地分组**：全部仓库 / 未分类 / 自定义分组（新建、重命名、删除），分组是纯本地视图层，存 `$DSH_HOME/storages/repo-browser/groups.json`，与 GitHub 侧无关
- **卡片 ⋮ 菜单**：移动到分组（单选即移）、设为私有/取消私有、归档/取消归档（经 GitHub `PATCH /repos/{owner}/{repo}`）
- **深浅主题**：太阳/月亮一键切换（记忆偏好）
- **面板**：右侧 `shell.overlay`，默认 360px，左边缘拖拽 360–720 调宽
- **凭据**：读取 DSH credentials 中的 `GITHUB_TOKEN`（修改私有/归档需要 `repo` scope）
- **新会话页自动隐藏**：未选会话、或当前是空白会话（新建未发言）时不渲染面板，并同时撤掉给内容让位的布局边距、收起已展开的卡片菜单；`open` 开关本身不改动，回到真实会话原样恢复

## 安装

```bash
dsh plugin --profile web add dsh-repo-browser
```

## 配置(GitHub)

仓库列表经 GitHub API 拉取,需要 `GITHUB_TOKEN`(插件不使用 SSH 公钥):

1. **生成 token**:GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
   - 仅浏览公开仓库:默认 scope 即可
   - 浏览私有仓库、使用 ⋮ 菜单的「设为私有 / 归档」:必须勾选 **`repo`** scope
2. **写入 credentials**(推荐,插件优先读取):

   ```yaml
   # ~/.dsh/.credentials.yaml
   refs:
     GITHUB_TOKEN: ghp_xxxxxxxxxxxxxxxx
   ```

   或设置环境变量 `GITHUB_TOKEN`(回退)
3. **重启 DSH** 生效。换 token 只需改 credentials 里的值。

## 结构

```
lib/index.js   host: 路由 /plugins/repo-browser/{list,groups,repo}
lib/client.js  client: shell.overlay + conversation.session.header.actions
cordis.patch.yml
```

## License

MIT。UI 结构参考 [dsh-file-browser](https://github.com/Lanzgale/dsh-file-browser)（fork 自 [joejojoking-cloud/dsh-file-explorer](https://github.com/joejojoking-cloud/dsh-file-explorer)，MIT）。
