'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

var jwt = require('../services/jwt');

function home( req, res ){
    res.status(200).send({
        message: 'HOME'
    });
}

function pruebas( req, res ){
    res.status(200).send({
        message: 'PRUEBAS'
    });
}

// Register
function saveUser( req, res ){

    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password){

        // Recibimos parametros
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // Comprobar usuarios duplicados
        User.find({ $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
        ]}).exec( ( err, users ) => {
            if(err) return res.status(500).send({message:'Error en la peticion de usuario'});

            if(users && users.length >= 1) {
                return res.status(404).send({message:'El usuario que se intenta registrar ya existe'});
            }else{
                // Si no existen usuarios duplicados, encriptamos la contraseña y guardamos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if(err) return res.status(500).send({message:'Error al guardar el usuario'});

                        if(userStored){
                            res.status(200).send({user: userStored});
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }
                    })
                })
            }
        })

    }else{
        res.status(200).send({
            message: 'Faltan completar campos'
        });
    };

};

// Login
function loginUser( req, res ){
    var params = req.body;

    var email = params.email;
    var password = params.password

    // Esta condicion seria = SELECT * FROM table WHERE email: email
    User.findOne( { email: email }, (err, user) => {
        if(err) return res.status(500).send({message: 'ERROR EN LA PETICION'});

        if(user){
            // Si existe un usuario entonces comparo la password ingresada con la password almacenada en bd
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){

                    //Comprobamos si nos llega un parametro por post para devolver un token o no.
                    if(params.gettoken){
                        //generar y devolvemos token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })

                    }else{
                        //Devolvemos los datos del usaurio
                        //Establecemos que al devolver el user, mande password undefined, para que no pueda ser leida desde el front.
                        user.password = undefined;
                        return res.status(200).send({user});
                    }

                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar!.'});
                }
            })

        }else{
            return res.status(404).send({message: 'No existe usuarios registrados con esas credenciales!.'});
        }
    })
}

// Conseguir datos de un usuario
function geOnetUser( req, res){
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message:'Error en la petición.'});

        if(!user) return res.status(404).send({message:'El usuario no existe.'});

        //Comprobamos si sigo al usuario que me llega por id
        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;

            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        })

    })
}

// Realiza una funcion asincrona para comprobar si seguimos y si nos sigue..
async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ user: identity_user_id, followed: user_id }).exec()
        .then((following) => {
            return following;
        })
        .catch((err) => {
            return handleError(err);
        });

    var followed = await Follow.findOne({ user: user_id, followed: identity_user_id }).exec()
        .then((followed) => {
            return followed;
        })
        .catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed
    };
}


// Obteniendo todos los usuarios paginados
function getAllUsers( req, res ){
    // Recojemos el id del usuario logueado
    var identityUserId = req.user.sub;

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    // Cantidad de usuarios que habra por pagina.
    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message:'Error en la petición.'});

        if(!users) return res.status(404).send({message:'No hay usuarios disponibles.'});

        followUserIds(identityUserId).then((value) => {


            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)

            });
        });
    })
}

// Realiza una funcion asincrona para sacar los ids de los que seguimos y los que nos siguen..
async function followUserIds(user_id){
    var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec()
        .then((following) => {

            var follows_clean = [];

            following.forEach( (follow) => {
                follows_clean.push(follow.followed);
            });

            return follows_clean;
        })
        .catch((err) => {
            return handleError(err);
        });

    var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec()
        .then((followed) => {
            var follows_clean = [];

            followed.forEach( (follow) => {
                follows_clean.push(follow.user);
            });

            return follows_clean;
        })
        .catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed
    };
}

// Obtendremos el contador de cuanta gente nos sigue, cuantos seguimos y cuantas publicaciones tenemos
function getCounters(req, res){

    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }

    getCountFollows(userId).then((value) => {
        return res.status(200).send(value);
    })
};

// Metodo para obtener la cantidad de seguidores y seguidos
async function getCountFollows(user_id){
    var following = await Follow.count({"user": user_id}).exec()
        .then((count) => {
            return count
        })
        .catch((err) => {
            return handleError(err);
        });

    var followed = await Follow.count({"followed": user_id}).exec()
        .then((count) => {
            return count
        })
        .catch((err) => {
            return handleError(err);
        });

    var publication = await Publication.count({"user":user_id}).exec()
        .then((count) => {
            return count
        })
        .catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed,
        publication: publication
    }
}

// Edicion de datos del usuario
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para modificar los datos del usuario.'});
    }
    
    User.find({ $or: [
                        { email: update.email.toLowerCase() },
                        { nick: update.nick.toLowerCase() }
                    ]
            }).exec( (err, users) => {

                var user_isset = false;
                users.forEach((user) => {
                    if(user && user._id != userId) user_isset = true
                });
                if(user_isset) return res.status(404).send({message: 'Los datos ya estan en uso.'});

                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate) => {
                    if(err) return res.status(500).send({message:'Error en la petición.'});
                
                    if(!userUpdate) return res.status(404).send({message:'No se ha podido actualizar el usuario.'});
                
                    return res.status(200).send({
                        user: userUpdate
                    });
                })
    })


}

// Subir avatar
function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){

        var files_path = req.files[Object.keys(req.files)[0]].path;

        var file_split = files_path.split('\\');

        var file_name = file_split[2];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if(userId != req.user.sub){
            return removeFileOfUpload(res, files_path, 'No tienes permiso para actualizar la imagen del usuario');
        }

        if(file_ext == 'png'|| file_ext == 'jpg'|| file_ext == 'jpeg'|| file_ext == 'gif'){
            // Actualizar documentro de usuario logueado
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdate) => {
                if(err) return res.status(500).send({message: 'Error en la peticion'});

                if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdate});

            });
        }else{
            return removeFileOfUpload(res, files_path, 'Extensión no valida');
        }


    }else{
        return res.status(200).send({message: 'No se han subido archivos'});
    }
}


function removeFileOfUpload(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    })
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;

    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    })
}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    geOnetUser,
    getAllUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}
