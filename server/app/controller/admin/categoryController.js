const CategoryModel = require("../../model/Category")


class CategoryController {
    async getAllCategories(req, res) {
        const categories = await CategoryModel.find({});
        // res.render("category/list");
    }

    async createCategory(req, res) {
        // res.render("category/create");
    }
    async createCategoryPost(req, res) {
        try {
            const { name } = req.body;

            const { error } = categoryValidation.validate({ name });
            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.message
                });
            }

            const existingCategory = await CategoryModel.findOne({ name: name.trim() });
            if (existingCategory) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: 'Category already exists'
                });
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
        // res.render("category/update");
    }

    async updateCategoryPut(req, res) {
          const { id } = req.params;
        const { name } = req.body;

        try {
            // Validate input
            const { error } = categoryValidation.validate({ name });
            if (error) {
                console.log("Validation Error:", error.message);
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Category name is required. " + error.message
                });
            }

            // Checking if category name already exists (excluding current)
            const existingCategory = await CategoryModel.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });

            if (existingCategory) {
                console.log("Name already exists");
                return res.status(httpStatusCode.Conflict).json({
                    status: false,
                    message: "Category already exists."
                });
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
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Category not found."
                });
            }

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
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Invalid category ID"
                });
            }

            const delCat = await CategoryModel.findByIdAndDelete(id);

            if (!delCat) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Category not found"
                });
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