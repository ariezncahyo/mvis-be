const { getUser } = require('../controllers/user');
const {
  authAccessToken,
  checkAccess,
} = require('../middlewares/authToken.middleware');

module.exports = (app) => {
  // API untuk upload image file
  app.post('/file', getUser);
};
