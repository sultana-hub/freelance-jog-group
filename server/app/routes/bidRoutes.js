const express = require('express');
const router = express.Router();
const BidController = require('../controller/BidController')


router.post('/',BidController.createBid);
router.get('/byjob/:jobId',BidController.getBidsByJob);
router.get('/byFreelancer/:freelancerId', BidController.getBidsByFreelancer);
router.post('/:bidId', BidController.updateBidStatus);
router.post('/:bidId', BidController.deleteBid);

module.exports = router