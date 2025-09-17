const { UserModel } = require("../../model/User");

class UserManageController {
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find().sort({ createdAt: -1 })
            const loginUser = req.user;
            res.render('user/user_manage', { users , loginUser });
        } catch (err) {
            res.status(500).send("Error fetching users: " + err.message);
        }
    }

    async createUser(req, res) {
        try {
            const loginUser = req.user;

            res.render("user/add_user" , { loginUser });
        } catch (err) {
            res.status(500).send("Error loading create user form: " + err.message);
        }
    }

    async createUserPost(req, res) {
        try {
            const loginUser = req.user;

            const { name, email, role } = req.body;
            await UserModel.create({ name, email, role });
            res.redirect("/admin/users" , { loginUser });
        } catch (err) {
            res.status(500).send("Error creating user: " + err.message);
        }
    }

    async updateUser(req, res) {
        try {
            const loginUser = req.user;

            const user = await UserModel.findById(req.params.id);
            if (!user) return res.status(404).send("User not found");
            res.render("user/edit_user", { user , loginUser });
        } catch (err) {
            res.status(500).send("Error loading update form: " + err.message);
        }
    }

    async updateUserPut(req, res) {
        try {
            const loginUser = req.user;

            const { name, email, role } = req.body;
            await UserModel.findByIdAndUpdate(req.params.id, { name, email, role });
            res.redirect("/admin/users" ,{ loginUser });
        } catch (err) {
            res.status(500).send("Error updating user: " + err.message);
        }
    }

    async deleteUser(req, res) {
        try {
            await UserModel.findByIdAndDelete(req.params.id);
            res.redirect("/admin/users");
        } catch (err) {
            res.status(500).send("Error deleting user: " + err.message);
        }
    }
}

module.exports = new UserManageController