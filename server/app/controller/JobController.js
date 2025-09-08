const httpStatusCode = require('../helper/httpStatusCode')
const { JobModel, jobValidation } = require('../model/Jobs')


class JobController {

    async createJob(req, res) {

        try {
             console.log(req.user)
            const { title, description, categoryId, budget, deadline, status } = req.body;

            // 1. Check role
            if (req.user.role !== "client") {
                return res.status(403).json({
                    status: false,
                    message: "Only clients can post jobs"
                });
            }


            // 2. Validate request body
            const { error } = jobValidation.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message
                });
            }

            // 3. Create job
            const newJob = new JobModel({
                clientId: req.user._id, // from JWT
                title,
                description,
                categoryId,
                budget,
                deadline,
                status: status || "open" // default open if not provided
            });

            // 4. Save job
            await newJob.save();

            return res.status(201).json({
                status: true,
                message: "Job created successfully",
                job: newJob
            });

        } catch (error) {
            console.error("Create Job Error:", error);
            return res.status(500).json({
                status: false,
                message: "Server error while creating job"
            });
        }

    }

    // Get all jobs with category name + client info
    async getAllJob(req, res) {
        try {
            const jobs = await JobModel.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category" // 👈 convert array to object
                },
                {
                    $lookup: {
                        from: "users", // 👈 your User collection name in MongoDB
                        localField: "clientId",
                        foreignField: "_id",
                        as: "client"
                    }
                },
                {
                    $unwind: "$client"
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        budget: 1,
                        deadline: 1,
                        status: 1,
                        createdAt: 1,
                        "category._id": 1,
                        "category.name": 1, // 👈 only include category name
                        "client._id": 1,
                        "client.name": 1,
                        "client.email": 1,
                    }
                }
            ]);

            return res.status(200).json({
                status: true,
                count: jobs.length,
                jobs,
            });
        } catch (error) {
            console.error("Error fetching jobs:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
            });
        }
    }

  // Edit job
   async updateJob(req, res) {
    try {
      const { id } = req.params; // job id
      const { error } = jobValidation.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ status: false, errors: error.details.map(e => e.message) });
      }

      // find job
      const job = await JobModel.findById(id);
      if (!job) {
        return res.status(404).json({ status: false, message: "Job not found" });
      }

      // check permission → only creator or admin
      if (req.user.role !== "admin" && job.clientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: false, message: "Not allowed to edit this job" });
      }

      // update job
      const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).json({ status: true, message: "Job updated successfully", job: updatedJob });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Server error" });
    }
  }

  // Delete job
   async deleteJob(req, res) {
    try {
      const { id } = req.params;

      const job = await JobModel.findById(id);
      if (!job) {
        return res.status(404).json({ status: false, message: "Job not found" });
      }

      // check permission
      if (req.user.role !== "admin" && job.clientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: false, message: "Not allowed to delete this job" });
      }

      await JobModel.findByIdAndDelete(id);

      res.status(200).json({ status: true, message: "Job deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Server error" });
    }
  }

}

module.exports = new JobController