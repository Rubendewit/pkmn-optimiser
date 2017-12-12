export const healthCheckHandler = async ctx => {
  ctx.body = {
    version: 0,
    buildNumber: process.env.BUILD_NUMBER || 0
  };
};
