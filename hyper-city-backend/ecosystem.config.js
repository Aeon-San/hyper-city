export default {
  apps: [
    {
      name: "backend",
      script: "src/index.js",
      cwd: ".",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 10000,
        HOST: "localhost",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 10000,
        HOST: "0.0.0.0",
      },
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 4000,
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_file: "./logs/backend.log",
    },
  ],
};
