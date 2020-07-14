'use strict'

const colors = require('colors');

const mongoose = require('mongoose');

const app = require('./app');
const port = 3800;

// Conexion a la db

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/spectrun_database', { useNewUrlParser:true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connection to the database made successfully!'.green);

            // Crear servidor
            app.listen(port, () => {
                console.log('Server running correctly on port:'.green, port);
            });

        })
        .catch(err => console.log(err .red));

