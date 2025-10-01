const { default: slugify } = require("slugify");
const httpStatusCode = require("../../helper/httpStatusCode");
const { CategoryModel, categoryValidation } = require("../../model/Category");
const mongoose = require("mongoose")



class CategoryController {
    async getAllCategories(req, res) {
        const categories = await CategoryModel.find({});
        const loginUser = req.user;
        res.render("category/category_manage", { categories , loginUser });
    }

    async createCategory(req, res) {
        const loginUser = req.user;
        res.render("category/add_category", { loginUser , messages: req.flash() });
    }
    async createCategoryPost(req, res) {
        try {
            const { name } = req.body;

            const { error } = categoryValidation.validate({ name });
            if (error) {
                req.flash("error", error.message);
                
            }

            const existingCategory = await CategoryModel.findOne({ name: name.trim() });
            if (existingCategory) {
                req.flash("error", "Category already exists");
                return res.redirect(`/admin/category-create`);
               
            }

            const categoryData = new CategoryModel({ name: name.trim() });
            const data = await categoryData.save();
            return res.redirect(`/admin/categories`);
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }

    async updateCategory(req, res) {
        const { id } = req.params;
        const category = await CategoryModel.findById(id);
        const loginUser = req.user;

        res.render("category/edit_category", { category , loginUser , messages: req.flash() });
    }

    async updateCategoryPost(req, res) {
          const { id } = req.params;
        const { name } = req.body;

        try {
            // Validate input
            const { error } = categoryValidation.validate({ name });
            if (error) {
                console.log("Validation Error:", error.message);
                req.flash("error", error.message);
                return res.redirect(`/admin/categories`);

            }

            // Checking if category name already exists (excluding current)
            const existingCategory = await CategoryModel.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });

            if (existingCategory) {
                console.log("Name already exists");
                req.flash("error", "Category already exists.");
                return res.redirect(`/admin/categories`);

            }

            // Updating category
            const category = await CategoryModel.findByIdAndUpdate(
                id,
                {
                    name: name.trim(),
                    slug: slugify(name, { lower: true, strict: true }),
                },
                { new: true, runValidators: true }
            );

            if (!category) {
                console.log("Category not found");
                req.flash("error", "Category not found");
               
            }
            req.flash("success", "Category updated successfully");
            console.log("Category updated successfully");
            res.redirect(`/admin/categories`);

        } catch (error) {
            console.error("Update error:", error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Server error: " + error.message
            });
        }



    }
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            // Validate MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                req.flash("error", "Invalid category ID");
            }

            const delCat = await CategoryModel.findByIdAndDelete(id);

            if (!delCat) {
                req.flash("error", "Category not found");
            }

            res.redirect(`/admin/categories`);
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }

    }
}

module.exports = new CategoryController();