
const express = require('express')
const UserAuthController = require('../controller/UserAuthController')
const { AuthCheck } = require('../middleware/auth')
const userImageUpload = require('../helper/userImageUploads')
const router = express.Router()


//   post     /api/auth/register
router.post('/register', userImageUpload.single('profilePic'), UserAuthController.register)

//   post     /api/auth/verify/email

router.post('/verify/email', UserAuthController.verifyEmail)

//  post   /api/auth/resend/otp
router.post('/resend/otp', UserAuthController.resendOtp)

//  post   /api/auth/login

router.post('/login', UserAuthController.login)

//update password loggedin user
router.put('/update-password', AuthCheck, UserAuthController.changePassword)

// post /api/auth/forgot-password   link 
router.post('/forgot-password', UserAuthController.forgetPasswordLink);

//reset password page to submit new password
router.post('/reset-password/:id/:token', UserAuthController.resetPassword);

// api/auth/profile/:userId
router.get('/profile/:userId', AuthCheck, UserAuthController.getProfile)
router.put('/profile/:userId/update/', AuthCheck, userImageUpload.single('profilePic'), UserAuthController.profileUpdate)

// api/auth/all-clients
router.get('/all-clients',UserAuthController.getAllClient)

// api/auth/all-freelancer
router.get('/all-freelancer',UserAuthController.getAllFreelancer)

module.exports = router