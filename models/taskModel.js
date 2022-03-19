const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    task: {
        type: String,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    poster:{
        type: String,
        required: true,
    },

    solver: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = taskModel = mongoose.model('task', TaskSchema);