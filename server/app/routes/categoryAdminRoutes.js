const express = require("express");
const CategoryAdminController = require("../controller/CategoryAdminController");
const router = express.Router();

// Admin panel category routes
router.get("/category/list", CategoryAdminController.list);
router.get("/category/add", CategoryAdminController.addForm);
router.post("/category/add", CategoryAdminController.add);
router.get("/category/edit/:id", CategoryAdminController.editForm);
router.post("/category/edit/:id", CategoryAdminController.edit);
router.post("/category/delete/:id", CategoryAdminController.delete);

module.exports = router;
