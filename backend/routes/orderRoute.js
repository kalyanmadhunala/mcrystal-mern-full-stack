import express from 'express'
import { placeOrderCOD, placeOrderStripe, placeOrderRazorpay, getAllOrders, userOrders, updateOrderStatus, verifyStripePayment, verifyRazorpayPayment, OrderInvoice, userOrderStatus } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import getAuthUser from '../middleware/getAuthUser.js'

const orderRouter = express.Router()

//admin order features
orderRouter.post('/allorderslist',adminAuth, getAllOrders)
orderRouter.post('/updateorderstatus', adminAuth, updateOrderStatus)

//user payment features
orderRouter.post('/placeordercod',getAuthUser, placeOrderCOD)
orderRouter.post('/placeorderstripe', getAuthUser, placeOrderStripe)
orderRouter.post('/placeorderrazorpay', getAuthUser, placeOrderRazorpay)

//user orders
orderRouter.post('/userorders', getAuthUser, userOrders)

//verifying payments
orderRouter.post('/verifystripepayment', getAuthUser, verifyStripePayment)
orderRouter.post('/verifyrazorpaypayment', getAuthUser, verifyRazorpayPayment)

//download invoice
orderRouter.post('/orderinvoice', getAuthUser, OrderInvoice)

//track order status
orderRouter.post('/trackorder', getAuthUser, userOrderStatus)

export default orderRouter