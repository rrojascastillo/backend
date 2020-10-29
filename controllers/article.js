'user strict'

var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
const { exists } = require('../models/article');


var controller = {
    datosCurso: (req, res) => {
        var param1 = req.body.param1;
        return res.status(200).send({
            curso: 'Master en frameworks',
            autor: 'Ronald Rojas',
            url: 'i2i',
            param1
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy accion test de controlador de articulos'
        });
    },
    save: (req, res) => {
        //Recoger parametros por post
        var params = req.body;

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //Crear Objeto a Guardar
            var article = new Article();
            //Asignar valoress
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Los datos no son validos!!'

                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        article: articleStored
                    });
                }

            });
            //Guardar articulo

            //Devolver respuesta
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'Los datos no son validos!!'

            });
        }

    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        query.sort('id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos!'

                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Np hay articulos para mostrar'

                });
            }

            return res.status(200).send({
                status: 'success',
                articles

            });

        });

    },

    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        //Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'El oid no existe'

            });

        }

        //Buscar el articulo
        var article = Article.findById(articleId, (err, article) => {

            if (err || !articleId) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'

                });

            }


            return res.status(200).send({
                status: 'success',
                article

            });

        })
        //Devolver en json


    },

    update: (req, res) => {

        //  recoger ID

        var articleId = req.params.id;
        var params = req.body;

        //Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'El oid no existe'

            });

        }

        //valida los datos

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'faltan datos por enviar'

            });
        }

        if (validate_title && validate_content) {
            //Find & updates
            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Ha ocurrido un error'

                    });

                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha encontrado el articulo'

                    });

                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated

                });

            });
        } else {

            return res.status(404).send({
                status: 'error',
                message: 'La validacion no es correcta'

            });
        }

    },

    delete: (req, res) => {

        //Recoger el ID
        var articleId = req.params.id;

        //Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encuentra ID '

            });

        }

        //Find & delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ha ocurrido un error'

                });

            }

            if (articleRemoved == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró el articulo'

                });

            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved

            });

        });



    },

    upload: (req, res) => {

        // Configurar el modulo de multyparty router


        // recojer el fhichero
        var file_name = 'Imagen no subida...';
        console.log(req.files);

        if (!req.files) {
            if (articleRemoved == null) {
                return res.status(404).send({
                    status: 'error',
                    message: file_name

                });
            }
        }
        //Conseguir el nombre y la extension.
        var file_path = req.files.file0.path;
        
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split['1'];

        //Comprobar la extension, solo imagenes.
        if (file_ext !='png' && file_ext !='jpg' && file_ext !='jpeg' && file_ext !='gif') {
               fs.unlink(file_path,(err) =>{
                return res.status(404).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'

                });
               });
            

        }else{
            var articleId = req.params.id;
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err,articleUpdated) => {
                
                if(err || !articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se encontró el articulo'
    
                    });

                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
        
                });
            });



        }
        //Buscar el articulo y actualizarlo
    },

    getImage: (req,res) =>{
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file,(exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
        
                });
            }
        });

    },
    search : (req, res)=>{

        // sacar string a buscar
        var searchString = req.params.search;
        // find or
        Article.find({ "$or" : [
            {"title" : { "$regex": searchString, "$options": "i"}},
            {"content" : { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date','descending']])
        .exec((err,articles) =>{
            if(err){
                return res.status(404).send({
                    status: 'error',
                    message: 'error en la petición !!!'
        
                });
            }
            if(articles.length==0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que mostrar !!!'
        
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
    
            });

        });

    }
};


module.exports = controller;