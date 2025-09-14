// controllers/CategoryAdminController.js
const { CategoryModel } = require("../model/Category");

class CategoryAdminController {
  async list(req, res) {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.render("category/category_manage", { categories });
  }

  addForm(req, res) {
    res.render("category/add_category");
  }

  async add(req, res) {
    const { name } = req.body;
    await CategoryModel.create({ name });
    res.redirect("/admin/category/list");
  }

  async editForm(req, res) {
    const category = await CategoryModel.findById(req.params.id);
    res.render("category/edit_category", { category });
  }

  async edit(req, res) {
    await CategoryModel.findByIdAndUpdate(req.params.id, { name: req.body.name });
    res.redirect("/admin/category/list");
  }

  async delete(req, res) {
    await CategoryModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/category/list");
  }
}

module.exports = new CategoryAdminController();
