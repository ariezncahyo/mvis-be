const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const response = require('../utils/response');

const authAccessToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return response.forbidden('Headers authorization is empty', res);
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, config.accessSecret, (err, _) => {
    if (err) {
      console.log(err);
      return response.unauthorized(err.message, res);
    } else {
      req.user = _
      next();
    }
  });
};

const authRefreshToken = (req, res, next) => {
  const refreshToken = req.headers.cookie.split('=');
  console.log(refreshToken.length)
  if (refreshToken.length != 2) {
    return response.unauthorized('Unauthorized', res);
  }
  jwt.verify(refreshToken[1], config.refreshSecret, (err, _) => {
    if (err) {
      console.log(err);
      return response.unauthorized(err.message || 'Unauthorized', res);
    } else {
      next();
    }
  });
};

const checkAccess = (accesses, isAll = false) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const tokenDecoded = jwt.decode(token);
    const owned_accesses = tokenDecoded.accesses

    const match = accesses.reduce((c, item) => owned_accesses.includes(item) ? c + 1 : c, 0)
    if (isAll && match !== accesses.length) {
      return response.unauthorized("User has no access", res);
    }

    if (match === 0) return response.unauthorized("User has no access", res);
    // return response.unauthorized("User has no access", res);

    // if (!owned_accesses.includes(access)) {
    // }
    next();
  };
}

module.exports = {
  authAccessToken,
  authRefreshToken,
  checkAccess
};
