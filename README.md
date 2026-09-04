# QRSS

[English](README.md) | [中文](README.zh-CN.md)

An RSS subscription reader built with Next.js and MongoDB for articles, YouTube videos, and podcasts — switch views from the top nav.

## Features

- Add RSS / Atom feeds, or paste a YouTube channel, `@handle`, or playlist URL (converted to the official RSS feed automatically)
- Top navigation: All / Articles / Videos / Podcasts / Favorites / Subscriptions
- UI language: English (default) or Chinese — choose from the language dropdown in the top nav; preference is saved in a cookie
- Timeline reading, embedded YouTube playback, and podcast audio playback
- Unread, favorites, refresh all, and search by title
- Items deduplicated by `{feedId, guid}` so refresh does not overwrite read status

## Getting started

Requires Docker (local MongoDB) and Node 22+.

```bash
cp .env.example .env.local
npm install
npm run db:up
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and go to **Subscriptions** to add feeds. You can also use the sample links on the page (Ruanyifeng, Hacker News, SSPAI, Fireship, The Vergecast).

## Environment variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Defaults to `mongodb://127.0.0.1:27017/qrss` |

Data model:

- `feeds`: subscription metadata (title, type, unread count)
- `items`: article / video / podcast entries (many-to-one reference to feeds, so unbounded items are not embedded in feed documents)
