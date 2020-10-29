'use strict'

//carga de modulos de node para crear el servidor.
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar Express
var app = express();

//Cargar rutas
var article_routes= require('./routes/article');

//Cargaar Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Activar Cors

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas

app.use('/api',article_routes);

//Exportar modulos
module.exports=app;