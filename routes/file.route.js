const { uploadFile } = require('../controllers/file');
const {
  authAccessToken,
} = require('../middlewares/authToken.middleware');

module.exports = (app) => {
  // API untuk upload image file
  app.post('/file', authAccessToken, uploadFile);
};
