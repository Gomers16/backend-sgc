module.exports = {
  apps: [
    {
      name: 'backend-sgc',
      script: './bin/server.ts',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      }
    }
  ]
};
