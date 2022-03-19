const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = userModel = mongoose.model('user', UserSchema);