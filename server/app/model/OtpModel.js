const mongoose = require("mongoose");

// Defining Schema
const otpverifySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m' // Automatically deletes document after 15 minutes
    }
});

//  Use existing model if already compiled
const OtpModel = mongoose.models.otp || mongoose.model("otp", otpverifySchema);

module.exports = OtpModel;
