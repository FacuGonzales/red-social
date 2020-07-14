'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Carga de rutas
const user_routes = require('./routes/user');
const follow_routes = require('./routes/follow');
const publication_routes = require('./routes/publication');
const message_routes = require('./routes/message');

// Carga de middlewares (no es mas que un metodo que se ejecua antes de que llegue al controlador)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configurar cabeceras http y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

// Rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

// Exportamos app

module.exports = app;