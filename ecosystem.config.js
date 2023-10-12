module.exports = {
  apps: [
    {
      name: 'forkohat-back',
      exec_mode: 'cluster',
      script: './server.js',
      instances: '1',
      wait_ready: true,
      autorestart: true,
      max_restarts: 1,
      watch: true,
      error_file: 'logs/forkohat-back/err.log',
      out_file: 'logs/forkohat-back/out.log',
      log_file: 'logs/forkohat-back/combined.log',
      time: true,
    },
  ],
}
