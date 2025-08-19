

const mongoose = require('mongoose')
const schema = mongoose.Schema
const Joi = require('joi')

const userValidation = Joi.object({
    name: Joi.string().required().min(3).trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(4).trim(),
    profilePic: Joi.string().required().trim(),
    role: Joi.string().valid('freelancer', 'client').required().trim(),
    skills: Joi.array().items(Joi.string().trim()).optional(),
    bio: Joi.string().optional().min(3).trim(),
})

const loginValidation = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(4).trim(),
})

const profileUpdateValidation=Joi.object({
    name: Joi.string().required().min(3).trim(),
    email: Joi.string().email().optional().trim(),
    password: Joi.string().optional().trim(),
    profilePic: Joi.string().required().trim(),
    role: Joi.string().valid('freelancer', 'client').required().trim(),
    skills: Joi.array().items(Joi.string().trim()).optional(),
    bio: Joi.string().optional().min(3).trim(),
})

const UserSchema = new schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'freelancer', 'client'],
        required: true
    },
    skills: {
        type: [String]
    },
    bio: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const UserModel = mongoose.model('user', UserSchema)
module.exports = { UserModel, userValidation, loginValidation,profileUpdateValidation }