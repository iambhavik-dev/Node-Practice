const mongoose = require("mongoose");
const User = require("./user.model");


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    }
},
    {
        timestamps: true
    });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
