const { getUser } = require('../controllers/user');
const {
  authAccessToken,
  checkAccess,
} = require('../middlewares/authToken.middleware');

module.exports = (app) => {
  // API untuk mendapatkan data user berdasarkan id
  app.get('/user', getUser);

  // API untuk update data user, informasi user id bisa didapatkan dari access token.
  app.put('/user', getUser);

  // API untuk merubah password, informasi user id bisa didapatkan dari access token.
  app.put('/user/change-password', getUser);
};
