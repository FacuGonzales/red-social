'use strict'

const moongose = require('mongoose');
const Schema = moongose.Schema;

const PublicationSchema = Schema({
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'}
});

module.exports = moongose.model('Publication', PublicationSchema);