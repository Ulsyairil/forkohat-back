module.exports = {
  apps: [
    {
      name: 'forkohat-back',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
