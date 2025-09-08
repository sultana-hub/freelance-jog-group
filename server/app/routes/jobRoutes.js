const express = require("express");
const  JobController  = require("../controller/JobController");
const {AuthCheck} = require("../middleware/auth");
const roleAuth=require('../middleware/roleMiddleware')
const router = express.Router();
// /api/create-job
router.post("/create-job", AuthCheck,roleAuth(['client']), JobController.createJob);
router.get('/get-jobs',AuthCheck,JobController.getAllJob)
router.put('/update-job/:id',AuthCheck,roleAuth(['client']),JobController.updateJob)
router.delete('/delete-job/:id',AuthCheck,roleAuth(['client']),JobController.deleteJob)
module.exports = router;