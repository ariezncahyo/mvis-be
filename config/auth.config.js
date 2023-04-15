module.exports = {
  accessSecret: process.env.ACCESS_TOKEN_SECRET_KEY || 'manismadu',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET_KEY || 'manismadu',
  jwtExp: process.env.NODE_ENV == 'production' ? '15m' : '30d',
  jwtRefreshExp: process.env.NODE_ENV == 'production' ? '1d' : '60d',
}