const express= require('express');
const AdminAuthenticationController = require('../../controller/admin/authenticationController');
const adminController = require('../../controller/admin/adminController');
const router = express.Router();

//  Admin Authentication Routes
router.get("/login", AdminAuthenticationController.login);


// Admin Routes 
router.get("/dashboard",adminController.dashboard )


module.exports = router;
