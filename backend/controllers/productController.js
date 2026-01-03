import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import productModel from "../models/productModel.js"



//function for add product
const addProduct = async (req, res) => {

    try {
        
        const {name, tagline, description, sellprice, price, material, category, subCategory, size, quantity, bestseller, premiumItem, exculsiveItem } = req.body


        const image1 = req.files.image1 && req.files.image1[0] 
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]
        const image6 = req.files.image6 && req.files.image6[0]

        const images = [image1, image2, image3, image4, image5, image6].filter((item) => item !== undefined )

        // Upload images to Cloudinary with optimization
    let imagesUrl = await Promise.all(
      images.map(async (item) => {

        const result = await cloudinary.uploader.upload(item.path, {
          folder: "products",
          
          transformation: [
            { width: 1000, crop: "limit" },
            { quality: "auto" },            
            { fetch_format: "auto" }        
          ]
        });

        // delete local temp file
        fs.unlinkSync(item.path);

        return result.secure_url;
      })
    );

    const productData = {
        name,
        tagline,
        description,
        sellprice: Number(sellprice),
        price: Number(price),
        material,
        category,
        subCategory,
        size,
        quantity: Number(quantity),
        bestseller: bestseller === "true" ? true : false,
        premiumItem: premiumItem === "true" ? true : false,
        exculsiveItem: exculsiveItem === "true" ? true : false,
        images: imagesUrl,
        date: Date.now()

    }

    const product = new productModel(productData)
    await product.save()

    res.json({success:true, msg: "Product added successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, msg: error.message})
    }

}


//function for list product
const listProducts = async(req, res) => {
    try {
        const products = await productModel.find({})

        res.json({success: true, products})
    } catch (error) {
        res.json({success: false, msg: error.message})
    }
}


//function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, msg:"Product is deleted successfully"})
    } catch (error) {
        console.log(error);        
        res.json({success: false, msg: error.message})
    }
}


//function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body

        const product = await productModel.findById(productId)

        res.json({success: true, product})

    } catch (error) {
        console.log(error);        
        res.json({success: false, msg: error.message})
    }
}

//function for share product info
const shareProduct = async (req, res) => {
  const product = await productModel.findById(req.params.productId);

  if (!product) return res.status(404).send("Not found");

  const image = product.images[0].replace(
    "/upload/",
    "/upload/f_jpg,q_80,w_1200/"
  );

  res.set("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${product.name} | M Crystal</title>

      <meta property="og:title" content="${product.name}" />
      <meta property="og:description" content="${product.tagline}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:image:secure_url" content="${image}" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="https://mcrystalz.web.app/products/${product._id}" />
      <meta property="og:type" content="product" />

      <meta name="twitter:card" content="summary_large_image" />

      <meta http-equiv="refresh" content="1;url=https://mcrystalz.web.app/products/${product._id}" />
    </head>
    <body></body>
    </html>
  `);
};




export {addProduct, listProducts, removeProduct, singleProduct, shareProduct}