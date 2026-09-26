window.__ModuleLoader__.load({
	id: "dsh-repo-browser",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		// ---------- styles ----------
		const CSS = `
/* 面板根：这一列由外壳（dsh-rightbar-shell）提供——位置、列宽、分隔线、背景、
   标题行都归外壳，这里只负责铺满它给的那块地方。 */
.fe-rb-panel {
  position: relative;
  width: 100%; height: 100%; min-width: 0; max-width: none;
  display: flex; flex-direction: column;
  overflow: hidden;
  /* ---- 插件自有配色变量(浅色,默认) ---- */
  --fe-bg: #f4f6f9;
  --fe-bg-1: #ffffff;
  --fe-bg-2: #e9ecf2;
  --fe-border: #d7dbe3;
  --fe-border-2: #c3c9d4;
  --fe-fg: #1f2430;
  --fe-fg-2: #5c6470;
  --fe-accent: #4d6bfe;
  --fe-ok: #18a058;
  --fe-err: #d03050;
  --fe-shadow: rgba(0,0,0,.12);
  background: transparent;
  color: var(--fe-fg);
  font-size: 13px; line-height: 1.45;
  pointer-events: auto;
  box-sizing: border-box;
}
.fe-rb-panel.fe-theme-dark {
  --fe-bg: #1B1B1C;
  --fe-bg-1: #2D2D2E;
  --fe-bg-2: #2D2D2E;
  --fe-border: #3a3a3b;
  --fe-border-2: #4a4a4c;
  --fe-fg: #e8eaee;
  --fe-fg-2: #9aa2ad;
  --fe-accent: #679EFE;
  --fe-ok: #63c99a;
  --fe-err: #f07178;
  --fe-shadow: rgba(0,0,0,.5);
}
.fe-rb-panel * { box-sizing: border-box; }
.fe-rb-iconbtn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; padding: 0;
  border: none; border-radius: 5px;
  background: transparent; color: var(--fe-fg-2);
  cursor: pointer;
}
.fe-rb-iconbtn:hover { background: var(--fe-bg-2); color: var(--fe-fg); }
.fe-rb-status { padding: 4px 10px; font-size: 11px; flex: none; }
.fe-rb-status-ok { color: var(--fe-ok); }
.fe-rb-status-err { color: var(--fe-err); }
.fe-rb-body { flex: 1; display: flex; min-height: 0; }
.fe-rb-groups {
  width: 150px; flex: none; overflow: auto;
  border-right: 1px solid var(--fe-border);
  padding: 6px 4px;
  user-select: none;
}
.fe-rb-groups-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 2px 6px 6px; color: var(--fe-fg-2); font-size: 11px;
}
.fe-rb-group-new {
  border: none; background: transparent; color: var(--fe-accent);
  cursor: pointer; font-size: 12px; padding: 0 2px; line-height: 1;
}
.fe-rb-group {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 6px; margin: 1px 0;
  border-radius: 5px; cursor: pointer; white-space: nowrap;
}
.fe-rb-group:hover { background: var(--fe-bg-2); }
.fe-rb-group-selected { background: var(--fe-bg-2); color: var(--fe-fg); font-weight: 600; }
/* 组名吃掉所有空隙，把后面的操作按钮与数字一起挤到右端 */
.fe-rb-group-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.fe-rb-group .fe-rb-count { color: var(--fe-fg-2); font-size: 11px; }
.fe-rb-group-op {
  display: none; border: none; background: transparent;
  color: var(--fe-fg-2); cursor: pointer; padding: 0 2px; font-size: 12px; line-height: 1;
}
.fe-rb-group:hover .fe-rb-group-op { display: inline-block; }
.fe-rb-group-op:hover { color: var(--fe-accent); }
.fe-rb-group-op.danger:hover { color: var(--fe-err); }
.fe-rb-rename-input {
  width: 100%; padding: 2px 4px; font-size: 12px;
  background: var(--fe-bg-1); border: 1px solid var(--fe-accent); border-radius: 4px;
  color: var(--fe-fg); outline: none;
}
.fe-rb-repos { flex: 1; overflow: auto; padding: 6px; }
.fe-rb-repo {
  display: block; width: 100%; text-align: left;
  padding: 8px 10px; margin: 2px 0;
  border: 1px solid var(--fe-border); border-radius: 7px;
  background: var(--fe-bg-1); color: var(--fe-fg);
  cursor: pointer;
}
.fe-rb-repo:hover { border-color: var(--fe-accent); }
.fe-rb-repo-top { display: flex; align-items: center; gap: 6px; }
.fe-rb-repo-name { font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fe-rb-repo-badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.fe-rb-repo-priv {
  color: var(--fe-ok); font-weight: 400; font-size: 11px;
  padding: 0 6px; border: 1px solid var(--fe-ok); border-radius: 8px;
  line-height: 1.5;
}
.fe-rb-repo-fork {
  color: var(--fe-accent); font-weight: 400; font-size: 11px;
  padding: 0 6px; border: 1px solid var(--fe-accent); border-radius: 8px;
  line-height: 1.5;
}
.fe-rb-repo-arch {
  color: var(--fe-err); font-weight: 400; font-size: 11px;
  padding: 0 6px; border: 1px solid var(--fe-err); border-radius: 8px;
  line-height: 1.5;
}
.fe-rb-repo-meta { display: flex; gap: 10px; margin-top: 4px; color: var(--fe-fg-2); font-size: 11px; }
.fe-rb-repo-desc {
  margin-top: 4px; color: var(--fe-fg-2); font-size: 12px;
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.fe-rb-repo-topics { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.fe-rb-topic {
  color: var(--fe-fg-2); font-weight: 400; font-size: 11px;
  padding: 0 6px; border: 1px solid var(--fe-border-2); border-radius: 8px;
  line-height: 1.5;
}
.fe-rb-repo { position: relative; }
.fe-rb-menu-btn {
  position: absolute; right: 6px; bottom: 6px;
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 22px; padding: 0;
  border: none; border-radius: 5px;
  background: transparent; color: var(--fe-fg-2);
  cursor: pointer;
}
.fe-rb-menu-btn:hover { background: var(--fe-bg-2); color: var(--fe-fg); }
.fe-rb-card-menu {
  position: fixed; z-index: 300;
  min-width: 190px; max-width: 230px;
  max-height: 64vh; overflow-y: auto;
  background: var(--fe-bg-1);
  border: 1px solid var(--fe-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--fe-shadow);
  padding: 4px;
  font-size: 12px; color: var(--fe-fg);
  user-select: none;
}
.fe-rb-card-menu-head {
  padding: 4px 8px 3px; color: var(--fe-fg-2);
  font-size: 11px; font-weight: 600;
}
.fe-rb-card-menu-item {
  display: flex; align-items: center; gap: 6px;
  width: 100%; text-align: left;
  padding: 5px 8px; border: none; border-radius: 5px;
  background: transparent; color: var(--fe-fg); cursor: pointer;
  white-space: nowrap;
}
.fe-rb-card-menu-item:hover { background: var(--fe-bg-2); }
.fe-rb-card-menu-item .chk { margin-left: auto; color: var(--fe-accent); flex: none; font-size: 12px; }
.fe-rb-card-menu-sep { height: 1px; background: var(--fe-border); margin: 4px 6px; }
.fe-rb-card-menu-item.danger { color: var(--fe-err); }
.fe-rb-card-menu-item.danger:hover { background: var(--fe-err); color: #fff; }
.fe-rb-empty { color: var(--fe-fg-2); padding: 20px 10px; text-align: center; font-size: 12px; }
.fe-rb-loading { color: var(--fe-fg-2); padding: 20px 10px; text-align: center; font-size: 12px; }
`;

		// ---------- icons ----------
		const iconPaths = {
			github: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.2 11.41.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 21.82 24 17.31 24 12 24 5.37 18.63 0 12 0z',
			close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
			refresh: 'M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
			sun: 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
			moon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
			dots: 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
			folder: 'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
			folderMultiple: 'M22 4h-8l-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M2 6H0v14a2 2 0 0 0 2 2h18v-2H2z',
			folderOutline: 'M20 18H4V8h16m0-2h-8l-2-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2',
			rename: 'm15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zm6.65.85c.39-.39.39-1.04 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z',
			delete: 'M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z',
			star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
		};
		const Icon = (props) => react.createElement('svg', {
			width: props.size || 14,
			height: props.size || 14,
			viewBox: '0 0 24 24',
			fill: 'currentColor',
			style: { display: 'block' },
		}, react.createElement('path', { d: iconPaths[props.name] }));

		// ---------- shared store (open / width / dark) ----------
		// 侧边栏主题：外壳拥有并广播，内容插件只跟随。
		// 这里**不能自持一份** —— 旧的 rb-theme 本地 state 让 r-b 永远停在深色，
		// 于是浅色模式下"背景跟外壳变浅了、卡片和分组标签还是深的"。
		const THEME_EVENT = 'dsh:sidebar-right:theme';
		const store = {
			open: false,
			dark: true,
			listeners: new Set(),
		};
		const emit = () => { for (const fn of Array.from(store.listeners)) fn() };
		const subscribe = (fn) => { store.listeners.add(fn); return () => { store.listeners.delete(fn) } };
		const setOpen = (value) => { store.open = !!value; emit() };
		const setDark = (v) => {
			const next = !!v;
			if (next === store.dark) return;
			store.dark = next;
			emit();
		};
		const useStore = () => {
			const [, setTick] = react.useState(0);
			react.useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
			return store;
		};

		// ---------- api ----------
		const api = {
			list: (view) => fetch('/plugins/repo-browser/list' + (view ? '?view=' + view : '')).then((r) => r.json()),
			getGroups: () => fetch('/plugins/repo-browser/groups').then((r) => r.json()),
			saveGroups: (groups) => fetch('/plugins/repo-browser/groups', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ groups }),
			}).then((r) => r.json()),
			repo: (fullName, action, value) => fetch('/plugins/repo-browser/repo', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ fullName, action, value: !!value }),
			}).then((r) => r.json()),
		};

		// ---------- helpers ----------
		const timeAgo = (iso) => {
			if (!iso) return '';
			const d = new Date(iso);
			if (isNaN(d.getTime())) return '';
			const days = Math.floor((Date.now() - d.getTime()) / 86400000);
			if (days <= 0) return '今天';
			if (days === 1) return '昨天';
			if (days < 30) return days + ' 天前';
			const months = Math.floor(days / 30);
			if (months < 12) return months + ' 个月前';
			return Math.floor(months / 12) + ' 年前';
		};

		// ---------- toggle button (session header) ----------
		// 标题行右端的工具按钮（外壳渲染，跟着档位走）
		const REFRESH_EVENT = 'dsh:repo-browser:refresh';
		const RepoBrowserActions = () => react.createElement('button', {
			className: 'fe-rb-iconbtn', title: '刷新',
			onClick: () => window.dispatchEvent(new CustomEvent(REFRESH_EVENT)),
		}, react.createElement(Icon, { name: 'refresh', size: 16 }));

		// ---------- main panel ----------
		const inject = ["slots", "rightbarShell"];

		const RepoBrowserPanel = (props) => {
			const s = useStore();
			// 新会话页判定:未选会话,或当前会话还是空白会话(新建但未发消息)。
			// 该页只有落地引导,没有会话标题与子代理信息,侧边栏在这里纯属遮挡,
			// 因此隐藏但不改动 open 状态 —— 回到真实会话时侧边栏自动恢复。
			const heroPage = props.useSessions((st) => {
				const id = st.current;
				if (id === undefined) return true;
				const entry = st.byId[id];
				return entry !== undefined && entry.blank === true;
			});
			const dark = s.dark;
			const [repos, setRepos] = react.useState(null);
			const [starredRepos, setStarredRepos] = react.useState(null);
			const [loadError, setLoadError] = react.useState(null);
			const [groups, setGroups] = react.useState({});
			const [selectedGroup, setSelectedGroup] = react.useState('__all__');
			const [menuFor, setMenuFor] = react.useState(null);
			const [menuAnchor, setMenuAnchor] = react.useState(null);
			const menuRef = react.useRef(null);
			const [editingGroup, setEditingGroup] = react.useState(null);
			const [newGroupInput, setNewGroupInput] = react.useState(false);

			const loadAll = () => {
				setLoadError(null);
				setMenuFor(null);
				setMenuAnchor(null);
				setRepos(null);
				api.list().then((r) => {
					if (r.error) { setLoadError(r.error); setRepos([]); return }
					setRepos(r.repos || []);
				}).catch((err) => {
					setLoadError(String((err && err.message) || err));
					setRepos([]);
				});
				api.getGroups().then((r) => {
					if (!r.error) setGroups(r.groups || {});
				});
			};
			react.useEffect(() => { loadAll() }, []);

			// Native-style layout yield: while the panel is open, the
			// conversation column ([data-phase=active]) gets right padding so
			// its content reflows instead of being covered by the panel.
			// 隐藏期间(新会话页)必须同时撤掉让位标记,否则落地页仍被推出空白边距。
			react.useEffect(() => {
				const root = document.documentElement;
				if (s.open && !heroPage) root.setAttribute('data-rb-panel-open', '');
				else root.removeAttribute('data-rb-panel-open');
				return () => {
					root.removeAttribute('data-rb-panel-open');
				};
			}, [s.open, heroPage]);
			react.useEffect(() => {
				const root = document.documentElement;
				root.style.setProperty('--rb-panel-width', width + 'px');
			}, [width]);
			react.useEffect(() => {
				if (!s.open || heroPage) { setMenuFor(null); setMenuAnchor(null) }
			}, [s.open, heroPage]);

			const groupNames = Object.keys(groups);
			const ungrouped = (repos || []).filter((r) => !groupNames.some((g) => (groups[g] || []).includes(r.name)));
			const loadStarred = () => {
				if (starredRepos !== null) return;
				api.list('starred').then((r) => {
					if (r.error) { setLoadError('Starred 列表失败: ' + r.error); return }
					setStarredRepos(r.repos || []);
				});
			};
			const visibleRepos = selectedGroup === '__starred__'
				? (starredRepos || [])
				: selectedGroup === '__all__'
					? (repos || [])
					: selectedGroup === '__ungrouped__'
						? ungrouped
						: (repos || []).filter((r) => (groups[selectedGroup] || []).includes(r.name));

			const saveGroups = (next) => {
				setGroups(next);
				api.saveGroups(next).then((r) => {
					if (r.error) setLoadError('分组保存失败: ' + r.error);
				});
			};

			const createGroup = (name) => {
				const n = String(name || '').trim();
				if (!n || groups[n]) return;
				saveGroups({ ...groups, [n]: [] });
				setSelectedGroup(n);
				setNewGroupInput(false);
			};
			const renameGroup = (oldName, newName) => {
				const n = String(newName || '').trim();
				if (!n || n === oldName) { setEditingGroup(null); return }
				if (groups[n]) return;
				const next = {};
				for (const [k, v] of Object.entries(groups)) next[k === oldName ? n : k] = v;
				saveGroups(next);
				if (selectedGroup === oldName) setSelectedGroup(n);
				setEditingGroup(null);
			};
			const deleteGroup = (name) => {
				if (!window.confirm('删除分组「' + name + '」?组内仓库将回到未分类。')) return;
				const next = { ...groups };
				delete next[name];
				saveGroups(next);
				if (selectedGroup === name) setSelectedGroup('__all__');
			};
			const moveRepo = (repoName, targetGroup) => {
				if (!repoName) return;
				const next = {};
				for (const [k, v] of Object.entries(groups)) next[k] = v.filter((x) => x !== repoName);
				if (targetGroup && targetGroup !== '__ungrouped__') {
					next[targetGroup] = [...(next[targetGroup] || []), repoName];
				}
				saveGroups(next);
			};

			const repoCount = (name) => (groups[name] || []).length;

			// ⋮ 菜单:点击菜单外任意处关闭
			react.useEffect(() => {
				if (!menuFor) return;
				const onDown = (e) => {
					if (menuRef.current && menuRef.current.contains(e.target)) return;
					if (e.target && e.target.closest && e.target.closest('.fe-rb-menu-btn')) return;
					setMenuFor(null);
					setMenuAnchor(null);
				};
				document.addEventListener('mousedown', onDown);
				return () => document.removeEventListener('mousedown', onDown);
			}, [menuFor]);

			const openMenu = (e, r) => {
				e.stopPropagation();
				const rect = e.currentTarget.getBoundingClientRect();
				setMenuAnchor({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
				setMenuFor((m) => (m === r.name ? null : r.name));
			};
			const patchRepo = (name, patch) => setRepos((list) => (list || []).map((x) => (x.name === name ? { ...x, ...patch } : x)));
			const setRepoPrivate = (r) => {
				const v = !r.private;
				if (v && !window.confirm('确定将「' + r.fullName + '」设为私有?仓库将对其他人不可见。')) return;
				api.repo(r.fullName, 'set-private', v).then((res) => {
					setMenuFor(null);
					setMenuAnchor(null);
					if (res.error) { setLoadError('设置私有失败: ' + res.error); return }
					patchRepo(r.name, { private: v });
				});
			};
			const setRepoArchived = (r) => {
				const v = !r.archived;
				if (v && !window.confirm('确定归档「' + r.fullName + '」?归档后仓库只读,可随时取消。')) return;
				api.repo(r.fullName, 'set-archived', v).then((res) => {
					setMenuFor(null);
					setMenuAnchor(null);
					if (res.error) { setLoadError('归档操作失败: ' + res.error); return }
					patchRepo(r.name, { archived: v });
				});
			};

			// ---------- render: group list ----------
			const renderGroupList = () => {
				const rows = [];
				const builtins = [
					{ id: '__starred__', label: 'Starred', icon: 'star', count: starredRepos ? starredRepos.length : null },
					{ id: '__all__', label: '全部仓库', icon: 'folderMultiple', count: (repos || []).length },
					{ id: '__ungrouped__', label: '未分类', icon: 'folderOutline', count: ungrouped.length },
				];
				for (const b of builtins) {
					rows.push(react.createElement('div', {
						key: b.id,
						className: 'fe-rb-group' + (selectedGroup === b.id ? ' fe-rb-group-selected' : ''),
						onClick: () => {
							setSelectedGroup(b.id);
							if (b.id === '__starred__') loadStarred();
						},
					},
						react.createElement(Icon, { name: b.icon, size: 13 }),
						react.createElement('span', { className: 'fe-rb-group-name' }, b.label),
						b.count !== null ? react.createElement('span', { className: 'fe-rb-count' }, b.count) : null,
					));
				}
				for (const g of groupNames) {
					rows.push(react.createElement('div', {
						key: g,
						className: 'fe-rb-group' + (selectedGroup === g ? ' fe-rb-group-selected' : ''),
						onClick: () => setSelectedGroup(g),
					},
						react.createElement(Icon, { name: 'folder', size: 13 }),
						react.createElement('span', { className: 'fe-rb-group-name' }, g),
						react.createElement('button', {
							className: 'fe-rb-group-op', title: '重命名',
							onClick: (e) => { e.stopPropagation(); setEditingGroup(g) },
						}, react.createElement(Icon, { name: 'rename', size: 13 })),
						react.createElement('button', {
							className: 'fe-rb-group-op danger', title: '删除',
							onClick: (e) => { e.stopPropagation(); deleteGroup(g) },
						}, react.createElement(Icon, { name: 'delete', size: 13 })),
						react.createElement('span', { className: 'fe-rb-count' }, repoCount(g)),
					));
				}
				return rows;
			};

			// 重命名输入行(顶替选中的组)
			const renderRenameInput = () => {
				if (!editingGroup) return null;
				return react.createElement('input', {
					className: 'fe-rb-rename-input',
					defaultValue: editingGroup,
					autoFocus: true,
					onKeyDown: (e) => {
						if (e.key === 'Enter') renameGroup(editingGroup, e.target.value);
						if (e.key === 'Escape') setEditingGroup(null);
					},
					onBlur: (e) => renameGroup(editingGroup, e.target.value),
				});
			};

			// ---------- render: repo card ----------
			const renderRepo = (r) => react.createElement('div', {
				key: r.name,
				className: 'fe-rb-repo',
				role: 'button',
				tabIndex: 0,
				title: '在 GitHub 打开',
				onClick: () => { setMenuFor(null); window.open('https://github.com/' + r.fullName, '_blank', 'noopener'); },
				onKeyDown: (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						window.open('https://github.com/' + r.fullName, '_blank', 'noopener');
					}
				},
			},
				react.createElement('div', { className: 'fe-rb-repo-top' },
					react.createElement('span', { className: 'fe-rb-repo-name' }, r.name),
					react.createElement('span', { style: { color: 'var(--fe-fg-2)', fontSize: 11, flex: 'none' } }, timeAgo(r.pushedAt)),
				),
				(r.private || r.fork || r.archived)
					? react.createElement('div', { className: 'fe-rb-repo-badges' },
						r.private ? react.createElement('span', { className: 'fe-rb-repo-priv' }, 'Priv') : null,
						r.fork ? react.createElement('span', { className: 'fe-rb-repo-fork' }, 'Fork') : null,
						r.archived ? react.createElement('span', { className: 'fe-rb-repo-arch' }, 'Arch') : null,
					)
					: null,
				r.description ? react.createElement('div', { className: 'fe-rb-repo-desc' }, r.description) : null,
				r.topics && r.topics.length > 0
					? react.createElement('div', { className: 'fe-rb-repo-topics' },
						r.topics.slice(0, 2).map((t) => react.createElement('span', { key: t, className: 'fe-rb-topic' }, t)),
						r.topics.length > 2 ? react.createElement('span', { className: 'fe-rb-topic' }, '+' + (r.topics.length - 2)) : null,
					)
					: null,
				react.createElement('div', { className: 'fe-rb-repo-meta' },
					r.language ? react.createElement('span', null, r.language) : null,
					react.createElement('span', null, '★ ' + r.stars),
					react.createElement('span', null, '⑂ ' + r.forks),
				),
				selectedGroup === '__starred__'
					? null
					: react.createElement('button', {
						className: 'fe-rb-menu-btn',
						title: '操作',
						'aria-label': '操作',
						onClick: (e) => openMenu(e, r),
					}, react.createElement(Icon, { name: 'dots', size: 15 })),
			);

			// ---------- render: card menu (⋮) ----------
			const renderCardMenu = () => {
				if (!menuFor || !menuAnchor) return null;
				const r = (repos || []).find((x) => x.name === menuFor);
				if (!r) return null;
				const inGroup = groupNames.filter((g) => (groups[g] || []).includes(r.name));
				const W = 200, H = 260;
				const panelLeft = window.innerWidth - width;
				let left = menuAnchor.right - W;
				if (left < panelLeft + 6) left = panelLeft + 6;
				let top = menuAnchor.bottom + 4;
				if (top + H > window.innerHeight - 6) top = Math.max(6, menuAnchor.top - H - 4);
				const items = [];
				items.push(react.createElement('div', { key: 'head', className: 'fe-rb-card-menu-head' }, '移动到'));
				items.push(react.createElement('button', {
					key: '__ungrouped__',
					className: 'fe-rb-card-menu-item',
					onClick: () => { moveRepo(r.name, '__ungrouped__'); setMenuFor(null); setMenuAnchor(null); },
				},
					react.createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, '未分类'),
					inGroup.length === 0 ? react.createElement('span', { className: 'chk' }, '✓') : null,
				));
				for (const g of groupNames) {
					items.push(react.createElement('button', {
						key: g,
						className: 'fe-rb-card-menu-item',
						onClick: () => { moveRepo(r.name, g); setMenuFor(null); setMenuAnchor(null); },
					},
						react.createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, g),
						inGroup.includes(g) ? react.createElement('span', { className: 'chk' }, '✓') : null,
					));
				}
				items.push(react.createElement('div', { key: 'sep', className: 'fe-rb-card-menu-sep' }));
				items.push(react.createElement('button', {
					key: 'priv',
					className: 'fe-rb-card-menu-item' + (r.private ? '' : ' danger'),
					onClick: () => setRepoPrivate(r),
				}, r.private ? '取消私有' : '设为私有'));
				items.push(react.createElement('button', {
					key: 'arch',
					className: 'fe-rb-card-menu-item' + (r.archived ? '' : ' danger'),
					onClick: () => setRepoArchived(r),
				}, r.archived ? '取消归档' : '归档'));
				return react.createElement('div', { className: 'fe-rb-card-menu', style: { left, top }, ref: menuRef }, items);
			};

			// 开合已交给外壳（rightbarShell），本插件只负责画内容
			react.useEffect(() => {
				const onRefresh = () => loadAll();
				window.addEventListener(REFRESH_EVENT, onRefresh);
				return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
			});

			if (heroPage) return null;
			return react.createElement(react.Fragment, null,
				react.createElement('div', { className: 'fe-rb-panel' + (dark ? ' fe-theme-dark' : '') },
					loadError ? react.createElement('div', { className: 'fe-rb-status fe-rb-status-err' }, '⚠ ' + loadError) : null,
					react.createElement('div', { className: 'fe-rb-body' },
						react.createElement('div', { className: 'fe-rb-groups' },
							react.createElement('div', { className: 'fe-rb-groups-head' },
								react.createElement('span', null, '分组'),
								newGroupInput
									? null
									: react.createElement('button', { className: 'fe-rb-group-new', title: '新建分组', onClick: () => setNewGroupInput(true) }, '＋'),
							),
							newGroupInput
								? react.createElement('input', {
									className: 'fe-rb-rename-input', placeholder: '分组名,回车确认',
									autoFocus: true,
									onKeyDown: (e) => {
										if (e.key === 'Enter') createGroup(e.target.value);
										if (e.key === 'Escape') setNewGroupInput(false);
									},
									onBlur: () => setNewGroupInput(false),
								})
								: null,
							renderRenameInput(),
							renderGroupList(),
						),
						react.createElement('div', { className: 'fe-rb-repos' },
							selectedGroup === '__starred__'
								? (starredRepos === null
									? react.createElement('div', { className: 'fe-rb-loading' }, '加载 Starred 仓库中…')
									: visibleRepos.length === 0
										? react.createElement('div', { className: 'fe-rb-empty' }, '暂无 Starred 仓库')
										: visibleRepos.map(renderRepo))
								: (repos === null
									? react.createElement('div', { className: 'fe-rb-loading' }, '加载仓库中…')
									: visibleRepos.length === 0
										? react.createElement('div', { className: 'fe-rb-empty' }, '该分组暂无仓库')
										: visibleRepos.map(renderRepo)),
						),
					),
					renderCardMenu(),
				),
			);
		};

		// ---------- apply ----------
		function apply(ctx) {
			const styleEl = document.createElement('style');
			styleEl.textContent = CSS;
			document.head.appendChild(styleEl);
			ctx.effect(() => () => { styleEl.remove() }, 'repo-browser: styles');

			// 主题：外壳切的时候广播，这里只跟随（监听装在 apply 里而不是组件里，
			// 这样面板还没挂载过也能收到——f-b 用的是同一套）。
			const onTheme = (e) => {
				const d = e && e.detail;
				if (d) setDark(!!d.dark);
			};
			window.addEventListener(THEME_EVENT, onTheme);
			ctx.effect(() => () => { window.removeEventListener(THEME_EVENT, onTheme) }, 'repo-browser: sidebar theme');

			const slots = ctx.get('slots');
			if (slots === undefined) return;
			// 方案 B：向外壳的 rightbarShell 服务报到一次，档位/图标/内容/按钮
			// 一起交出去；开合、列宽、标题行、深浅都归外壳。
			ctx.effect(() => ctx.rightbarShell.addMode({
				id: 'repos',
				label: '仓库浏览器',
				icon: 'github',
				render: (props) => react.createElement(RepoBrowserPanel, props),
				actions: () => react.createElement(RepoBrowserActions, null),
			}), 'repo-browser: rightbar mode');
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	},
});
