const { getUser } = require('../controllers/user');
const {
  authAccessToken,
  checkAccess,
} = require('../middlewares/authToken.middleware');

module.exports = (app) => {
  // API untuk membuat post baru, informasi user id bisa didapatkan dari access token.
  app.post('/post', getUser);
  
  // API untuk edit data post
  app.put('/post/:id', getUser);
  
  // API untuk delete data post
  app.delete('/post/:id', getUser);
  
  // API untuk like post
  app.put('/post/like/:id', getUser);

  // API untuk like post
  app.put('/post/unlike/:id', getUser);

  // API untuk get list post
  app.get('/post', getUser);

  // API get post by id
  app.get('/post/:id', getUser);
  
  // API get list post by user id
  app.get('/post/user/:id', getUser);

};
