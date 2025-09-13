

class AdminAuthenticationController {
    // Admin Login
    async login(req, res) {
        res.render("authentication/login");
    }
}

module.exports = new AdminAuthenticationController();