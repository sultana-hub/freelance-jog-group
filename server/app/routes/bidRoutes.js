const express = require('express');
const router = express.Router();
const BidController = require('../controller/BidController')
const {AuthCheck} = require("../middleware/auth");
const roleAuth=require('../middleware/roleMiddleware')

// POST /api/bids/:jobId
router.post('/:jobId', AuthCheck,roleAuth(['freelancer']),BidController.createBid);

//Get /api/bids/byjob/:jobId
router.get('/byjob/:jobId', AuthCheck,roleAuth(['client','admin']),BidController.getBidsByJob);

//Get /api/bids/byFreelancer/:freelancerId
router.get('/byFreelancer/:freelancerId',AuthCheck,roleAuth(['freelancer']), BidController.getBidsByFreelancer);

// PATCH /api/bids/:bidId/status
router.patch('/:bidId/status', AuthCheck,roleAuth(['client']), BidController.updateBidStatus);


// DELETE /api/bids/:bidId
router.delete("/:bidId", AuthCheck , roleAuth(['freelancer','admin']), BidController.deleteBid);

module.exports = router