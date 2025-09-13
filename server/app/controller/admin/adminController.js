

class AdminController {
    async dashboard(req, res) {
        res.render('dashboard', { title: 'Admin Dashboard' });
    }
}

module.exports = new AdminController();