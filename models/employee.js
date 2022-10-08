const mongoose = require('mongoose')

const Schema = mongoose.Schema
const employeeSchema = new Schema({
    name: {
        type: String, required: true
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
    DateOfJoin: {
        type: Date, required: true
    },
    isAdmin: {
        type: Boolean, default: false
    }
    ,
    // employerId: {
    //     type: String
    // },

    password: {
        type: String, required: true
    }
}, { timestamps: true })

const employee = mongoose.model('employees', employeeSchema)
module.exports = employee