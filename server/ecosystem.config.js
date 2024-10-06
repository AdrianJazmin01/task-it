module.exports = {
  apps: [
    {
      name: "Taskit",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
