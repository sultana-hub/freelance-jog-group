const express= require('express');
const AdminAuthenticationController = require('../../controller/admin/authenticationController');
const router = express.Router();

//  Admin Authentication Routes
router.get("/login", AdminAuthenticationController.login);


module.exports = router;
