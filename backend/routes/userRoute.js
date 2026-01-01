import express from 'express'
import { loginUser, registerUser, verifyUserOTP, logoutUser, sendResetOTP, resetPassword, userExists, userData, verifyUserResetOTP, getAddresses, addAddress } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js';
import getAuthUser from '../middleware/getAuthUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/usercheck', userExists)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logoutUser)
userRouter.post('/verify-account', authUser, verifyUserOTP)
userRouter.get('/userdata', getAuthUser, userData)
userRouter.post('/send-reset-otp', sendResetOTP)
userRouter.post('/verify-reset-otp', verifyUserResetOTP)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/getaddresses', getAuthUser, getAddresses)
userRouter.post('/createaddress', getAuthUser, addAddress)

export default userRouter;
