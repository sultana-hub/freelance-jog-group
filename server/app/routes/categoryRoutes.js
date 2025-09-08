const express=require("express")
const CategoryController=require('../controller/CategoryController')
const router=express.Router()

//category admin route

//create category

//api end point  POST   /api/category/create
router.post('/category/create', CategoryController.createCategory)

// get all category
//api end point  GET   /api/category/list
router.get('/category/list', CategoryController.getAllCategories)

//update category
//api end point  PUT   /api/category/update/:id
router.put('/category/update/:id', CategoryController.updateCategory)

//delete category
//api end point  PUT   /api/category/delete/:id
router.delete('/category/delete/:id',CategoryController.deleteCategory)

module.exports=router