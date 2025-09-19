const Bid = require('../model/bid');
const { JobModel } = require('../model/Jobs'); // Corrected import to get JobModel
const User = require('../model/User');

class BidController {
    // Create a new bid
    async createBid(req, res) {
        try {
            const { jobId, freelancerId, bidAmount, coverLetter } = req.body;
            const newBid = new Bid({
                jobId,
                freelancerId,
                bidAmount,
                coverLetter,
                status: 'pending'
            });

            const bid = await newBid.save();
            res.status(201).json({ message: 'Bid created successfully', bid });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create bid', error: error.message });
        }
    }

    // Get all bids for a specific job (Client view)
    async getBidsByJob(req, res) {
        try {
            const { jobId } = req.params;

            const bids = await Bid.find({ jobId }).populate('freelancerId', 'name profileImg bio');

            if (!bids || bids.length === 0) {
                return res.status(404).json({ message: 'No bids found for this job' });
            }

            res.status(200).json(bids);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch bids', error: error.message });
        }
    }

    // Get all bids by a specific freelancer (Freelancer dashboard)
    async getBidsByFreelancer(req, res) {
        try {
            const { freelancerId } = req.params;

            const bids = await Bid.find({ freelancerId }).populate('jobId', 'title budget deadline');

            if (!bids || bids.length === 0) {
                return res.status(404).json({ message: 'No bids found for this freelancer' });
            }

            res.status(200).json(bids);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch bids', error: error.message });
        }
    }

    // Update a bid status
    async updateBidStatus(req, res) {
        try {
            const { bidId } = req.params;
            const { status } = req.body;

            if (!['accepted', 'rejected'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status provided' });
            }

            const updatedBid = await Bid.findByIdAndUpdate(
                bidId,
                { status },
                { new: true }
            );

            if (!updatedBid) {
                return res.status(404).json({ message: 'Bid not found' });
            }

            if (status === 'accepted') {
                await JobModel.findByIdAndUpdate(
                    updatedBid.jobId,
                    { status: 'in_progress' },
                    { new: true }
                );
            }

            res.status(200).json({ message: `Bid status updated to ${status}`, updatedBid });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update bid status', error: error.message });
        }
    }

    // Controller function to delete a bid
    async deleteBid(req, res) {
        try {
            const { bidId } = req.params;

            const deletedBid = await Bid.findByIdAndDelete(bidId);

            if (!deletedBid) {
                return res.status(404).json({ message: 'Bid not found' });
            }

            res.status(200).json({ message: 'Bid withdrawn successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete bid', error: error.message });
        }
    }
}

module.exports = new BidController();
