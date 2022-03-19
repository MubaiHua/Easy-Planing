const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    session: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = logModel = mongoose.model('log', LogSchema);