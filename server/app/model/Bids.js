const mongoose = require('mongoose');
const Joi = require("joi");

const bidsValidation = Joi.object({
  bidAmount: Joi.number().min(1).required(),
  coverLetter: Joi.string().required(), 
 
});


const bidStatusValidation = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required()
});



const bidSchema = new mongoose.Schema({
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },
    freelancerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidAmount:{
        type: Number,
        required: true
    },
    coverLetter:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt:{
        type: Date,
        default: Date.now
  }
});

const BidModel = mongoose.model('bid', bidSchema);
module.exports ={ BidModel,bidsValidation,bidStatusValidation};