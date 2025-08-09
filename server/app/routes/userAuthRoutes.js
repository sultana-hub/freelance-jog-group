
const express=require('express')
const UserAuthController = require('../controller/UserAuthController')
const { AuthCheck } = require('../middleware/auth')
const userImageUpload=require('../helper/userImageUploads')
const router=express.Router()


//   post     /api/auth/register
router.post('/register',userImageUpload.single('profilePic'),UserAuthController.register)

//   post     /api/auth/verify/email

router.post('/verify/email',UserAuthController.verifyEmail)

//  post   /api/auth/resend/otp
router.post('/resend/otp',UserAuthController.resendOtp)

//  post   /api/auth/login

router.post('/login',UserAuthController.login)


 router.post('/reset-password/:id/:token',UserAuthController.resetPassword);
// router.post('/reset-password',AuthCheck ,AuthController.resetPassword);

// post /api/auth/forgot-password  
 router.post('/forgot-password',UserAuthController.forgotPassword);
// router.post('/reset-password-link',AuthController.resetPasswordLink);

// router.get('/dashboard',AuthController.dashboard)
// router.post('/update/password',AuthController.updatePassword)

// router.get('/profile/:userId',AuthCheck ,UserAuthController.getProfile)
// router.put('/profile/:userId/update/', AuthCheck , userImageUpload.single('profilePic') ,UserAuthController.profileUpdate)


module.exports=router