const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String, required: true, unique: true
    },

    email: {
        type: String, unique: true, required: true
    },
    password: {
        type: String, required: true
    }
}, { timestamps: true })


const user = mongoose.model('users', userSchema)
module.exports = user