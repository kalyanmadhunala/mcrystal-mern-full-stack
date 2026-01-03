import express from "express"
import { addProduct, listProducts, removeProduct, shareProduct, singleProduct } from "../controllers/productController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const productRouter = express.Router()

productRouter.post("/addproduct",adminAuth, upload.fields([{name: "image1", maxCount:1},{name: "image2", maxCount:1},{name: "image3", maxCount:1},{name: "image4", maxCount:1},{name: "image5", maxCount:1},{name: "image6", maxCount:1}]), addProduct)
productRouter.post("/removeproduct",adminAuth, removeProduct)
productRouter.get("/productslist", listProducts)
productRouter.get("/singleproduct", singleProduct)
productRouter.get("/product/:productId", shareProduct);


export default productRouter;