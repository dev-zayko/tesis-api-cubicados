const express = require('express');
const app = express();
const {sequelize} = require('./models/index');
const bodyParser = require("express");
const favicon = require("serve-favicon");
const path = require("path");

// Settings
const PORT = process.env.DB_PORT;
const HOST = process.env.DB_HOST;

// Middlewares
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));

// Rutas
app.use(require('./routes'));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.locals.moment = require('moment');

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, function () {
  console.log(`Escuchando en http://localhost:${PORT}`);

  sequelize.authenticate().then(() => {
    console.log('Nos hemos conectado a la base de datos!');
  })
})
