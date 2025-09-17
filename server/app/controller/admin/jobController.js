const { JobModel } = require("../../model/Jobs");


class JobController {
    async getAllJobs(req, res) {
        try {
            const loginUser = req.user;
            const jobs = await JobModel.find({}).populate("categoryId", "name").populate("clientId", "name");
            console.log(jobs);
            res.render("jobs/jobs", { loginUser, jobs });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Server error" });
        }

    }

    async deleteJob(req, res) {
        try {
            const id = req.params.id;
            await JobModel.findByIdAndDelete(id);
            res.redirect("/admin/jobs");

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Server error" });

        }
    }
}

module.exports = new JobController();