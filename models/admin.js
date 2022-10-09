const mongoose = require('mongoose')

const Schema = mongoose.Schema
var objectId = Schema.objectId
const adminSchema = new Schema({
    name: {
        type: String, required: true
    },

    email: {
        type: String, unique: true, required: true
    },
    contact: {
        type: String, required: true
    },
    Organization: {
        type: String, required: true
    },

    // employerId: {
    //     type: String
    // },

    password: {
        type: String, required: true
    }
}, { timestamps: true })

const admin = mongoose.model('admins', adminSchema)
module.exports = admin