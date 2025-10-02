const express= require('express');
const AdminAuthenticationController = require('../../controller/admin/authenticationController');
const adminController = require('../../controller/admin/adminController');
const router = express.Router();
const {isLogin } = require('../../middleware/authCheckEjs/authCheckEjs');


const categoryController = require('../../controller/admin/categoryController');
const userManageController = require('../../controller/admin/userManageController');
const jobController = require('../../controller/admin/jobController');
const userImageUpload = require('../../helper/userImageUploads');
const bidsController = require('../../controller/admin/bidsController');
const { isAdmin } = require('../../middleware/auth');



//  Admin Authentication Routes
router.get("/login", AdminAuthenticationController.login);
router.post("/login", AdminAuthenticationController.loginPost);
router.post("/logout",isLogin, isAdmin, AdminAuthenticationController.logout);


// Admin Routes 
router.get("/dashboard",isLogin, isAdmin, adminController.dashboard )
router.get("/profile",isLogin , isAdmin, adminController.profile)


// Admin Category Routes
router.get("/categories", isAdmin, isLogin, categoryController.getAllCategories);
router.get("/category-create", isAdmin, isLogin, categoryController.createCategory);
router.post("/category-create", isAdmin, categoryController.createCategoryPost);
router.get("/category-update/:id",isLogin,isAdmin, categoryController.updateCategory);
router.post("/category-update/:id",isLogin, isAdmin, categoryController.updateCategoryPost); 
router.post("/category-delete/:id",isLogin,isAdmin, categoryController.deleteCategory);


// User Management Routes
router.get("/users",isLogin,isAdmin, userManageController.getAllUsers);
// router.get("/user-create",isLogin, userManageController.createUser);
// router.post("/user-create", userImageUpload.single("profilePic"), userManageController.createUserPost);
router.get("/user-update/:id",isLogin,isAdmin, userManageController.updateUser);
router.post("/user-update/:id", isLogin, isAdmin, userImageUpload.single("profilePic"), userManageController.updateUserPut); 
router.post("/user-delete/:id",isLogin,isAdmin, userManageController.deleteUser);


// Job Management Routes
router.get("/jobs",isLogin, isAdmin, jobController.getAllJobs);
router.post("/job-delete/:id",isLogin,isAdmin, jobController.deleteJob);

// Bids Management Routes
router.get("/manage-bids",isLogin,isAdmin, bidsController.getAllBids);
router.post("/update-bid-status/:bidId",isLogin,isAdmin, bidsController.updateBidStatus);





module.exports = router;
