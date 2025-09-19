
const bcrypt = require('bcryptjs');
const { UserModel } = require('../../model/User');
const path = require('path');
const fs = require('fs');


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

    // async createUser(req, res) {
    //     try {
    //         const loginUser = req.user;
    //         res.render("user/add_user" , { loginUser });

    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).send("Error loading create user form: " + err.message);
    //     }
    // }

    // async createUserPost(req, res) {
    //     try {

    //       const { name , email , password , role } = req.body;

    //     if (!name || !email || !password || !role) {
    //         return res.status(400).send("All fields are required");
    //     }

    //     const existingUser = await UserModel.findOne({ email });
    //     if (existingUser) {
    //         return res.status(400).send("User already exists");
    //     }

    //     // Handle file upload
    //     let profilePicPath = null;
    //     if (req.file) {
    //         profilePicPath = req.file.path;
    //     }

    //     const hashedPassword = await bcrypt.hash(password, 10);

    //     await UserModel.create({
    //         name,
    //         email,
    //         isVerified: true,
    //         password: hashedPassword,
    //         role,
    //         profilePic: profilePicPath 
    //     });


    //         res.redirect("/admin/users");

    //     } catch (err) {
    //         res.status(500).send("Error creating user: " + err.message);
    //     }
    // }

    async updateUser(req, res) {
        try {
            const loginUser = req.user;

            const user = await UserModel.findById(req.params.id);
            if (!user) return res.status(404).send("User not found");
            // console.log("user",user);
            res.render("user/edit_user", { user , loginUser });
        } catch (err) {
            res.status(500).send("Error loading update form: " + err.message);
        }
    }

    async updateUserPut(req, res) {
        try {
            const { name, email, role } = req.body;

            const user = await UserModel.findById(req.params.id);
            if (!user) return res.status(404).send("User not found");
            
            const oldProfilePicPath = user.profilePic;

            let profilePicPath = oldProfilePicPath;
            if (req.file) {
                profilePicPath = req.file.path;
            }

            await UserModel.findByIdAndUpdate(req.params.id, { name, email, role, profilePic: profilePicPath });

            if (oldProfilePicPath && profilePicPath !== oldProfilePicPath) {
                const filePath = path.join(__dirname, "../", oldProfilePicPath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            res.redirect("/admin/users");
        } catch (err) {
            res.status(500).send("Error updating user: " + err.message);
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (user.profilePic) {
                const filePath = path.join(__dirname, "../", user.profilePic);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            res.redirect("/admin/users");
        } catch (err) {
            res.status(500).send("Error deleting user: " + err.message);
        }
    }
}

module.exports = new UserManageController