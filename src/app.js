const express = require('express');
const mongoose = require('mongoose');
const { connectionString } = require('./config/database');
const routes = require('./routes');

class App {
  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }
}

module.exports = new App().express;
