
const { CategoryModel } = require("../../model/Category");
const jobModel = require("../../model/Jobs");

const { UserModel } = require("../../model/User");
class AdminController {
    async dashboard(req, res) {
        try {
            // Users
            const totalAdmin = await UserModel.countDocuments({ role: "admin" });
            const totalUser = await UserModel.countDocuments({ role: { $ne: "admin" } });
            const totalFreelancers = await UserModel.countDocuments({ role: "freelancer" });
            const totalClients = await UserModel.countDocuments({ role: "client" });

            // Categores
            const totalCategories = await CategoryModel.countDocuments({});

            // Jobs
            const totalJobs = await jobModel.JobModel.countDocuments({});
            const totalOpenJobs = await jobModel.JobModel.countDocuments({ status: "open" });
            const totalClosedJobs = await jobModel.JobModel.countDocuments({ status: "closed" });
            const totalInProgressJobs = await jobModel.JobModel.countDocuments({ status: "in_progress" });

            const users = {
                totalAdmin,
                totalUser,
                totalFreelancers,
                totalClients
            }

            const jobs = {
                totalJobs,
                totalOpenJobs,
                totalClosedJobs,
                totalInProgressJobs
            }

            const loginUser = req.user;
            // console.log("Login User" ,loginUser)

  
            res.render('dashboard', { title: 'Admin Dashboard', users, jobs, totalCategories , loginUser });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Server error while fetching dashboard data" });
        }
    }
}

module.exports = new AdminController();
