module.exports = {
  accessSecret: process.env.ACCESS_TOKEN_SECRET_KEY || 'manismadu',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET_KEY || 'manismadu',
  jwtExp: '15m',
  jwtRefreshExp: '1d',
}