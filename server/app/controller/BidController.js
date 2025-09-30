// const { BidModel, bidsValidation, bidStatusValidation } = require('../model/bid');
// const { JobModel } = require('../model/Jobs'); // Corrected import to get JobModel
// const { UserModel } = require('../model/User');
// const httpStatus = require('../helper/httpStatusCode')
// class BidController {
// Create a new bid
// async createBid(req, res) {
//     try {
//         const { jobId, freelancerId, bidAmount, coverLetter } = req.body;
//         const newBid = new Bid({
//             jobId,
//             freelancerId,
//             bidAmount,
//             coverLetter,
//             status: 'pending'
//         });

//         const bid = await newBid.save();
//         res.status(201).json({ message: 'Bid created successfully', bid });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create bid', error: error.message });
//     }
// }

// Get all bids for a specific job (Client view)
// async getBidsByJob(req, res) {
//     try {
//         const { jobId } = req.params;

//         const bids = await BidModel.find({ jobId }).populate('freelancerId', 'name profileImg bio');

//         if (!bids || bids.length === 0) {
//             return res.status(404).json({ message: 'No bids found for this job' });
//         }

//         res.status(200).json(bids);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch bids', error: error.message });
//     }
// }



// Get all bids by a specific freelancer (Freelancer dashboard)
// async getBidsByFreelancer(req, res) {
//     try {
//         const { freelancerId } = req.params;

//         const bids = await Bid.find({ freelancerId }).populate('jobId', 'title budget deadline');

//         if (!bids || bids.length === 0) {
//             return res.status(404).json({ message: 'No bids found for this freelancer' });
//         }

//         res.status(200).json(bids);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch bids', error: error.message });
//     }
// }






// // Update a bid status
// async updateBidStatus(req, res) {
//     try {
//         const { bidId } = req.params;
//         const { status } = req.body;

//         if (!['accepted', 'rejected'].includes(status)) {
//             return res.status(400).json({ message: 'Invalid status provided' });
//         }

//         const updatedBid = await Bid.findByIdAndUpdate(
//             bidId,
//             { status },
//             { new: true }
//         );

//         if (!updatedBid) {
//             return res.status(404).json({ message: 'Bid not found' });
//         }

//         if (status === 'accepted') {
//             await JobModel.findByIdAndUpdate(
//                 updatedBid.jobId,
//                 { status: 'in_progress' },
//                 { new: true }
//             );
//         }

//         res.status(200).json({ message: `Bid status updated to ${status}`, updatedBid });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update bid status', error: error.message });
//     }
// }





// Controller function to delete a bid
// async deleteBid(req, res) {
//     try {
//         const { bidId } = req.params;

//         const deletedBid = await Bid.findByIdAndDelete(bidId);

//         if (!deletedBid) {
//             return res.status(404).json({ message: 'Bid not found' });
//         }

//         res.status(200).json({ message: 'Bid withdrawn successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to delete bid', error: error.message });
//     }
// }






// }

// module.exports = new BidController();


const { BidModel, bidsValidation, bidStatusValidation } = require('../model/Bids');
const { JobModel } = require('../model/Jobs'); // Corrected import to get JobModel
const { UserModel } = require('../model/User');
const httpStatus = require('../helper/httpStatusCode')

class BidController {

    async createBid(req, res) {
        try {
            const freelancerId = req.user._id; // from JWT auth
            const jobId = req.params.jobId // from job list
            const jobData = {
                bidAmount: req.body.bidAmount,
                coverLetter: req.body.coverLetter

            }

            const { error, value } = bidsValidation.validate(jobData)

            if (error) {
                return res.status(httpStatus.BadRequest).json({
                    message: "Validation failed" + error.details[0].message
                });
            }

            // Check job exists
            const job = await JobModel.findById(jobId);
            if (!job) {
                return res.status(httpStatus.NotFound).json({ message: "Job not found" });
            }

            // Prevent duplicate bids
            const existingBid = await BidModel.findOne({ jobId, freelancerId });
            if (existingBid) {
                return res.status(httpStatus.BadRequest).json({ message: "You already placed a bid on this job" });
            }

            // Create bid
            const newBid = new BidModel({
                jobId,
                freelancerId,
                bidAmount: value.bidAmount,
                coverLetter: value.coverLetter

            });

            const bid = await newBid.save();
            return res.status(httpStatus.Create).json({ message: "Bid created successfully", bid });
        } catch (error) {
            res.status(httpStatus.InternalServerError).json(
                {
                    message: "Failed to create bid",
                    error: error.message
                }
            );
        }
    }
    async getBidsByJob(req, res) {
        try {
            const { jobId } = req.params;

            // Check if job exists
            const job = await JobModel.findById(jobId);
            if (!job) return res.status(404).json({ message: "Job not found" });

            // Only woner client can view bids
            if (req.user._id.toString() !== job.clientId.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }

            const bids = await BidModel.find({ jobId })
                .populate('freelancerId', 'name profileImg bio')
                .sort({ createdAt: -1 });

            if (!bids || bids.length === 0) {
                return res.status(404).json({ message: 'No bids found for this job' });
            }

            res.status(200).json(bids);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch bids', error: error.message });
        }
    }

    // Get all bids by a specific freelancer (Freelancer dashboard)
    async getBidsByFreelancer(req, res) {
        try {
            const { freelancerId } = req.params;

            // Only the logged-in freelancer can view their bids
            if (req.user._id.toString() !== freelancerId) {
                return res.status(403).json({ message: "Access denied" });
            }

            const bids = await BidModel.find({ freelancerId })
                .populate('jobId', 'title budget deadline')
                .sort({ createdAt: -1 });

            if (!bids || bids.length === 0) {
                return res.status(404).json({ message: 'No bids found for this freelancer' });
            }

            res.status(200).json(bids);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch bids', error: error.message });
        }
    }

    // Update a bid status by owner client
    async updateBidStatus(req, res) {
        try {
            const { bidId } = req.params;
            const statusData = {
                status: req.body.status
            }
            // Validate status
            const { error, value } = bidStatusValidation.validate(statusData);
            if (error) {
                return res.status(400).json({
                    message: "Invalid status",
                    errors: error.details.map(e => e.message),
                });
            }
            const { status } = value;

            // Find bid
            const bid = await BidModel.findById(bidId);
            if (!bid) return res.status(404).json({ message: "Bid not found" });

            // Find job and check client ownership
            const job = await JobModel.findById(bid.jobId);
            if (!job) return res.status(404).json({ message: "Job not found" });

            if (req.user._id.toString() !== job.clientId.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }

            // Update bid status
            bid.status = status;
            const updatedBid = await bid.save();

            // If accepted, update job and reject other bids
            if (status === "accepted") {
                await JobModel.findByIdAndUpdate(job._id, { status: "in_progress" });
                await BidModel.updateMany(
                    { jobId: job._id, _id: { $ne: bidId } },
                    { status: "rejected" }
                );
            }

            return res.status(200).json({ message: `Bid status updated to ${status}`, updatedBid });

        } catch (error) {
            return res.status(500).json({ message: "Failed to update bid status", error: error.message });
        }
    }

    //Freelancer: can delete only their own pending bids
    async deleteBid(req, res) {
        try {
            const { bidId } = req.params;

            // Find bid
            const bid = await BidModel.findById(bidId);
            if (!bid) return res.status(404).json({ message: "Bid not found" });

            // Check permissions
            if (req.user.role === "admin") {
                // Admin can delete any bid
            } else if (req.user._id.toString() === bid.freelancerId.toString() && bid.status === "pending") {
                // Freelancer can delete their own pending bid
            } else {
                return res.status(403).json({ message: "Access denied" });
            }

            await BidModel.findByIdAndDelete(bidId);
            return res.status(200).json({ message: "Bid deleted successfully" });

        } catch (error) {
            return res.status(500).json({ message: "Failed to delete bid", error: error.message });
        }
    }

}


module.exports = new BidController();
