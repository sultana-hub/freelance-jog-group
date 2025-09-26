const { BidModel } = require("../../model/Bids")
class BidsController {
    async getAllBids(req, res) {
        const loginUser = req.user;
        const bids = await BidModel.find({}).populate("freelancerId", "name").populate("jobId", "title");
        console.log(bids);
        res.render("bids/manage-bids", { loginUser, bids });
    }

    async updateBidStatus(req, res) {
        try {
            const { status } = req.body;
            await BidModel.findByIdAndUpdate(req.params.bidId, { status });
            res.redirect("/admin/manage-bids");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating bid status");
        }

    }
}

module.exports = new BidsController();