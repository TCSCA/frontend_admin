module.exports = {
  apps: [{
    name: "WebDesa-Administrativo",
    script: ".next/standalone/server.js",
    cwd: "/var/www/proyectos/InterfazAdministrativa",
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_restarts: 5,
    restart_delay: 2000,
    env: {
      NODE_ENV: "production",
      PORT: 3001,
      HOSTNAME: "0.0.0.0",
      NEXT_PUBLIC_API_BASE_URL_ASSETS: "ordenesmedicas"
    }
  }]
}