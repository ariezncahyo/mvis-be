const { 
  createPost, 
  updatePost, 
  deletePost, 
  likePost, 
  unlikePost,
  getPost,
  getPostById,
  getPostByUserId
} = require('../controllers/post');
const {
  authAccessToken
} = require('../middlewares/authToken.middleware');

module.exports = (app) => {
  // API untuk membuat post baru, informasi user id bisa didapatkan dari access token.
  app.post('/post', authAccessToken, createPost);
  
  // API untuk edit data post berdasarkan id
  app.put('/post/:post_id', authAccessToken, updatePost);
  
  // API untuk delete data post
  app.delete('/post/:post_id', authAccessToken, deletePost);
  
  // API untuk like post
  app.put('/post/like/:post_id', authAccessToken, likePost);

  // API untuk like post
  app.put('/post/unlike/:post_id', authAccessToken, unlikePost);

  // API untuk get list post
  app.get('/post', authAccessToken, getPost);

  // API get post by id
  app.get('/post/:post_id', authAccessToken, getPostById);
  
  // API get list post by user id
  app.get('/post/user/:user_id', authAccessToken, getPostByUserId);
};
