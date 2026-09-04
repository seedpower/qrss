# QRSS

[English](README.md) | [中文](README.zh-CN.md)

用 Next.js 和 MongoDB 做的 RSS 订阅阅读器：文章、YouTube 视频、播客，顶部导航切换。

## 功能

- 添加 RSS / Atom，或直接粘贴 YouTube 频道、`@handle`、播放列表链接（自动转官方 RSS）
- 顶部导航：全部 / 文章 / 视频 / 播客 / 收藏 / 订阅
- 界面语言：英文（默认）或中文 — 通过顶部导航的语言下拉框选择，偏好保存在 cookie
- 时间线阅读、YouTube 内嵌播放、播客音频播放
- 未读、收藏、刷新全部、按标题搜索
- 条目按 `{feedId, guid}` 去重，刷新不会覆盖已读状态

## 启动

需要 Docker（本机 MongoDB）和 Node 22+。

```bash
cp .env.example .env.local
npm install
npm run db:up
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，进入「订阅」添加源。可点页面上的示例（阮一峰、Hacker News、少数派、Fireship、The Vergecast）。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `MONGODB_URI` | 默认 `mongodb://127.0.0.1:27017/qrss` |

数据模型：

- `feeds`：订阅源元数据（标题、类型、未读数）
- `items`：文章 / 视频 / 播客条目（与源一对多引用，避免把无界条目嵌进源文档）
