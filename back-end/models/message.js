'use strict'

const moongose = require('mongoose');
const Schema = moongose.Schema;

const MessageSchema = Schema({
    text: String,
    viewed: String,
    created_at: String,
    emitter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = moongose.model('Message', MessageSchema);