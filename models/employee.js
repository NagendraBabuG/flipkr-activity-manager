const mongoose = require('mongoose')

const Schema = mongoose.Schema
const employeeSchema = new Schema({
    name: {
        type: String, required: true, unique: true
    },

    email: {
        type: String, unique: true, required: true
    },
    contact: {
        type: String, required: true
    },
    Department: {
        type: String, required: true
    },
    joiningDate: {
        type: Date, required: true
    },
    isAdmin: {
        type: Boolean, default: false
    }
    ,
    employerId: {
        type: String, required: true
    },

    password: {
        type: String, required: true
    }
}, { timestamps: true })


const user = mongoose.model('users', userSchema)
module.exports = user