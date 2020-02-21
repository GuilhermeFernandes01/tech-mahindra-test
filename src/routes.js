const { Router } = require('express');
const User = require('./controllers/UserController');
const Session = require('./controllers/SessionController');
const authMiddleware = require('./middlewares/auth');

const routes = Router();

routes.post('/signup', User.create);
routes.post('/signin', Session.create);

routes.get('/buscar', authMiddleware.validateAuthorization, User.search);

module.exports = routes;
