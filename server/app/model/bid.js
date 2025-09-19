const mongoose = require('mongoose');


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

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;