module.exports = {
  apps: [
    {
      name: 'forkohat-app',
      exec_mode: 'cluster',
      script: './server.js',
      instances: '1',
      wait_ready: true,
      autorestart: true,
      max_restarts: 1,
      watch: false,
      time: true,
      error_file: '.logs/err.log',
      out_file: '.logs/out.log',
      merge_logs: false,
      log_type: "json",
    },
  ],
}
