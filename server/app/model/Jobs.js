const mongoose=require('mongoose')
const Joi = require("joi");

const jobValidation = Joi.object({
  title: Joi.string().min(3).max(100).required().trim(),
  description: Joi.string().min(10).required().trim(),
  categoryId: Joi.string().required(), // category comes from dropdown (ObjectId as string)
  budget: Joi.number().positive().required(),
  deadline: Joi.date().greater("now").required(),
  status: Joi.string().valid("open", "in_progress", "closed").optional(), 
});


const jobSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "closed", "in_progress"],
    default: "open"
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const JobModel=mongoose.model('job',jobSchema)
module.exports={jobValidation,JobModel};
