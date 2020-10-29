'use strict'

var mongoose= require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.Promise= global.Promise;
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useNewUrlParser: true})
    .then(()=>{console.log('La conexion a la base de datos se ejecuto Exitosamente');
    //Crear sevidor HTTP
        app.listen(port,() => {
            console.log('Servidor corriendo en http://localhost:'+port)
        });

    });