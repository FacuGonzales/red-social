'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var api = express.Router();

var md_auth = require('../middlewares/authentication');

api.get('/probandoMd', md_auth.ensureAuth, MessageController.pruebaMessage);
api.post('/new-message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/messages-receiver/:page?', md_auth.ensureAuth, MessageController.getReceiverMessage);
api.get('/messages-emit/:page?', md_auth.ensureAuth, MessageController.getEmitMessage);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnViewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessage);

module.exports = api;