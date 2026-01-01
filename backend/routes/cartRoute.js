import express from 'express'
import { addToCart, getCartData, setCartData, updateCart } from '../controllers/cartController.js'
import authUser from '../middleware/authUser.js'
import getAuthUser from '../middleware/getAuthUser.js'

const cartRouter = express.Router()

cartRouter.post('/addtocart', getAuthUser, addToCart)
cartRouter.post('/updatecart', getAuthUser, updateCart)
cartRouter.post('/getcartdata', getAuthUser, getCartData)
cartRouter.post('/setcartdata', getAuthUser, setCartData)


export default cartRouter