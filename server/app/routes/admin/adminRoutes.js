const express= require('express');
const AdminAuthenticationController = require('../../controller/admin/authenticationController');
const adminController = require('../../controller/admin/adminController');
const router = express.Router();
const {isLogin} = require('../../middleware/authCheckEjs/authCheckEjs');

const categoryController = require('../../controller/admin/categoryController');
const userManageController = require('../../controller/admin/userManageController');
const jobController = require('../../controller/admin/jobController');
const userImageUpload = require('../../helper/userImageUploads');



//  Admin Authentication Routes
router.get("/login", AdminAuthenticationController.login);
router.post("/login", AdminAuthenticationController.loginPost);
router.post("/logout", AdminAuthenticationController.logout);


// Admin Routes 
router.get("/dashboard",isLogin,adminController.dashboard )
router.get("/profile",isLogin ,adminController.profile)


// Admin Category Routes
router.get("/categories",isLogin, categoryController.getAllCategories);
router.get("/category-create",isLogin, categoryController.createCategory);
router.post("/category-create", categoryController.createCategoryPost);
router.get("/category-update/:id",isLogin, categoryController.updateCategory);
router.post("/category-update/:id", categoryController.updateCategoryPost); 
router.post("/category-delete/:id",isLogin, categoryController.deleteCategory);


// User Management Routes
router.get("/users",isLogin, userManageController.getAllUsers);
router.get("/user-create",isLogin, userManageController.createUser);
router.post("/user-create", userImageUpload.single("profilePic"), userManageController.createUserPost);
router.get("/user-update/:id",isLogin, userManageController.updateUser);
router.post("/user-update/:id",userImageUpload.single("profilePic"), userManageController.updateUserPut); 
router.post("/user-delete/:id",isLogin, userManageController.deleteUser);


// Job Management Routes
router.get("/jobs",isLogin, jobController.getAllJobs);
router.post("/job-delete/:id",isLogin, jobController.deleteJob);



module.exports = router;
