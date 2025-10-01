const { loginValidation, UserModel } = require("../../model/User");
const httpStatusCode = require("../../helper/httpStatusCode");
const jwt = require('jsonwebtoken')
const { comparePassword } = require("../../middleware/auth");
const flash = require('connect-flash');



class AdminAuthenticationController {
    // Admin Login
    async login(req, res) {
        const messages = {
            success: req.flash('success'),
            error: req.flash('error')
        };
        res.render("authentication/login", { messages });
        console.log(req.flash());

    }

    async loginPost(req, res) {
        try {
            const { email, password } = req.body

            const loginData = { email, password }

            const { error } = loginValidation.validate(loginData)

            if (error) {
                req.flash('error', error.message);
                return res.redirect('/admin/login');
            }

            const user = await UserModel.findOne({ email, role: "admin" });
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/admin/login');
            }

            // Check if user verified
            if (!user.isVerified) {
                return res.status(401).json({ status: false, message: "Your account is not verified" });
            }
            const ismatch = comparePassword(password, user.password)
            if (!ismatch) {
                req.flash('error', 'Invalid password');
                return res.redirect('/admin/login');
            }
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic
            }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" })

            res.cookie('token', token, {
                // httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 2
            });
            req.flash('success', 'Login successful');

            res.redirect('/admin/dashboard');


        } catch (error) {
            console.log(error);
            req.flash('error', 'Something went wrong', error.message);

        }

    }

    async logout(req, res) {
        try {
            res.clearCookie('token');
            req.flash('success', 'Logout successful');
            res.redirect('/admin/login');
        } catch (error) {
            console.log(error);
            req.flash('error', 'Something went wrong', error.message);

        }

    }
}

module.exports = new AdminAuthenticationController();