module.exports = {
  apps: [{
    name: "WebDesa-Administrativo",
    script: "pnpm",
    args: "start -p 3001",
    interpreter: "none",
    env: {
      NODE_ENV: "production"
    }
  }]
}