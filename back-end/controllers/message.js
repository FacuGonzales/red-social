'use strict'

var moment = require('moment');
var mongoosePagination = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function pruebaMessage(req, res){
    res.status(200).send({message: 'Mensajes'});
}

// Envio un mensaje
function saveMessage(req, res){
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Faltan los campos necesarios'});

    var message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';
    
    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!messageStored) return res.status(404).send({message: 'Error al enviar mensaje'});

        return res.status(200).send({message: messageStored});

    })

}

// Obtengo los mensajes que me enviaron
function getReceiverMessage(req, res){
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({'receiver':userId}).populate('emitter', 'image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!messages) return res.status(404).send({message: 'No hay mensajes'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        })
    })
}

// Obtengo los mensajes que envie yo
function getEmitMessage(req, res){
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({'emitter':userId}).populate('emitter receiver', 'image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!messages) return res.status(404).send({message: 'No hay mensajes'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        })
    })
}

function getUnViewedMessages(req, res){
    var userId = req.user.sub;

    Message.count({receiver: userId, viewed: 'false'}).exec((err, count) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        return res.status(200).send({
            'unviewed': count
        })
    })
}

function setViewedMessage(req, res){
    var userId = req.user.sub;

    Message.update({receiver: userId, viewed: 'false'}, {viewed: 'true'}, {'multi': true}, (err, messageUpdate) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        
        return res.status(200).send({
            messages: messageUpdate
        })
    })
}


module.exports = {
    pruebaMessage,
    saveMessage,
    getReceiverMessage,
    getEmitMessage,
    getEmitMessage,
    getUnViewedMessages,
    setViewedMessage
}