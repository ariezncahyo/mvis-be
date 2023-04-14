const { register, login, logout } = require('../controllers/auth');

module.exports = (app) => {
  // API untuk mendaftar user baru
  app.post('/auth/register', register);

  // API untuk masuk ke aplikasi
  app.post('/auth/login', login);

  // API untuk keluar dari aplikasi
  app.post('/auth/logout', logout);
};
