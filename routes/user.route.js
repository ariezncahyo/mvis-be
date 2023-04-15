const { getUser, updateUser, changePassword } = require('../controllers/user');
const {
  authAccessToken,
} = require('../middlewares/authToken.middleware');

module.exports = (app) => {
  // API untuk mendapatkan data user berdasarkan id
  app.get('/user', authAccessToken, getUser);

  // API untuk update data user, informasi user id bisa didapatkan dari access token.
  app.put('/user', authAccessToken, updateUser);

  // API untuk merubah password, informasi user id bisa didapatkan dari access token.
  app.put('/user/change-password', authAccessToken, changePassword);
};
