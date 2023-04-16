const routes = {};
routes.auth = require('./auth.route');
routes.user = require('./user.route');
routes.post = require('./post.route');
routes.file = require('./file.route');
module.exports = routes;
