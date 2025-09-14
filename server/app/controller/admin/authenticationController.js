const { loginValidation, UserModel } = require("../../model/User");
const httpStatusCode = require("../../helper/httpStatusCode");
const jwt = require('jsonwebtoken')
const { comparePassword } = require("../../middleware/auth");



class AdminAuthenticationController {
    // Admin Login
    async login(req, res) {
        res.render("authentication/login");
    }

    async loginPost (req, res) {
         try {
            const { email, password } = req.body

            const loginData = { email, password }

            const { error } = loginValidation.validate(loginData)

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.message
                });
            }

            const user = await UserModel.findOne({ email, role: "admin" });
            if(!user){
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "user not found"
                })
            }
          
            // Check if user verified
            if (!user.isVerified) {
                return res.status(401).json({ status: false, message: "Your account is not verified" });
            }
            const ismatch = comparePassword(password, user.password)
            if (!ismatch) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "invalid password"
                })
            }
            const token = jwt.sign({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" })

              res.cookie('token', token, {
                // httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 2
            });

            res.redirect('/admin/dashboard');
            

        } catch (error) {
            console.log(error);

        }
        
    }

    async logout(req, res) {
        res.clearCookie('token');
        res.redirect('/admin/login');
    }
}

module.exports = new AdminAuthenticationController();