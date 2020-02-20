const { Router } = require('express');
const User = require('./controllers/UserController');
const Session = require('./controllers/SessionController');

const routes = Router();

routes.post('/signup', User.create);
routes.post('/signin', Session.create);

module.exports = routes;
