# marksloboda.com

Personal site. Plain HTML in `public/`, served by a dependency-free Node
server (`server.js`) so it deploys on Railway with nothing to configure.

## Run locally

```
npm start
# http://localhost:3000
```

## Deploy

Railway watches `main` on GitHub and redeploys on push. `PORT` is set by
Railway. The server 301-redirects the bare domain to `www`, so DNS at IONOS
is: `www` CNAME to the Railway target, apex forwards to `https://www.marksloboda.com`.
