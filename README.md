# Beach Fallback Worker

Cloudflare Worker for beach.30north.coffee

## Features

- Reverse proxy to beach-orders.30north.coffee
- Automatic fallback to static.30north.coffee
- Telegram outage notifications
- Maintenance mode
- Cloudflare KV outage tracking

## Deploy

```bash
npm install
npx wrangler login
npx wrangler deploy
```

## Local Development

```bash
npx wrangler dev
```