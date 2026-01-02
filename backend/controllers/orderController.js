import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import productModel from "../models/productModel.js";
import { invoiceTemplate } from "../utils/invoiceTemplate.js";
import { generateInvoicePdf } from "../utils/generateInvoicePdf.js";
import { uploadInvoice } from "../utils/uploadInvoice.js";
import { v4 as uuidv4 } from "uuid";
import { amountInWords } from "../utils/amountToWords.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go one level up from controllers/ to backend/, then into assets/
const logoPath = path.join(__dirname, "..", "assets", "m_crystal_logo_cbglsu.png");

let logoDataUrl = "https://res.cloudinary.com/dbanrkx7w/image/upload/v1767120544/m_crystal_logo_cbglsu.png"; // fallback

try {
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString("base64");
    logoDataUrl = `data:image/png;base64,${logoBase64}`;
    console.log("Logo loaded successfully from local file");
  } else {
    console.warn("Local logo file not found, using Cloudinary fallback");
    logoDataUrl = "https://res.cloudinary.com/dbanrkx7w/image/upload/v1767120544/m_crystal_logo_cbglsu.png";
  }
} catch (err) {
  console.error("Error reading logo file:", err);
  logoDataUrl = "https://res.cloudinary.com/dbanrkx7w/image/upload/v1767120544/m_crystal_logo_cbglsu.png";
}

//global variable
const currency = "inr";
const delivery_charges = 100.00;
//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

//placing order using COD
const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    //Create Order
    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    //Prepare Invoice Data
    const invoiceNo = `INV-${uuidv4().slice(0, 8).toUpperCase()}`;

    const subtotal = items.reduce(
      (sum, item) => sum + item.sellprice * item.quantity,
      0
    );

    const gst = +(subtotal * 0.18).toFixed(2);
    const total = subtotal + gst;
    const grandtotal = subtotal + delivery_charges
      const totalInWords = amountInWords(grandtotal)

    //Generate Invoice HTML
    const html = invoiceTemplate({
      logoUrl: logoDataUrl,
      order: newOrder,
      invoiceNo,
      invoiceDate: new Date().toLocaleDateString(),
      customer: {
        name: address.firstName + " " + address.lastName,
        address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      },
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.sellprice,
      })),
      subtotal,
      gst,
      delivery_charges,
      total,
      amountWords: totalInWords,
    });

    //Generate PDF
    const pdfBuffer = await generateInvoicePdf(html, invoiceNo);

    //Upload to Cloudinary
    const uploaded = await uploadInvoice(pdfBuffer, invoiceNo);

    //Save Invoice in Order
    newOrder.invoice = {
      invoiceNo: invoiceNo,
      invoice_url: uploaded.secure_url,
    };

    await newOrder.save();

    //Clear User Cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    //Reduce Product Stock
    for (const item of items) {
      await productModel.findByIdAndUpdate(item._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    return res.json({
      success: true,
      msg: "Order Placed",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, msg: error.message });
  }
};

//placing order using Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: "false",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.sellprice * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: delivery_charges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&order_id=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&order_id=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

//verify stripe payment
const verifyStripePayment = async (req, res) => {
  const userId = req.user.id;
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      const orderData = await orderModel.findById(orderId);
      
      //Prepare Invoice Data
      const invoiceNo = `INV-${uuidv4().slice(0, 8).toUpperCase()}`;

      const subtotal = orderData.items.reduce(
        (sum, item) => sum + item.sellprice * item.quantity,
        0
      );

      const gst = +(subtotal * 0.18).toFixed(2);
      const total = subtotal + gst;
      const grandtotal = subtotal + delivery_charges
      const totalInWords = amountInWords(grandtotal)

      const address = orderData.address;

      //Generate Invoice HTML
      const html = invoiceTemplate({
        logoUrl: logoDataUrl,
        order: orderData,
        invoiceNo,
        invoiceDate: new Date().toLocaleDateString(),
        customer: {
          name: address.firstName + " " + address.lastName,
          address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        },
        items: orderData.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.sellprice,
        })),
        subtotal,
        gst,
        delivery_charges,
        total,
        amountWords: totalInWords,
      });

      //Generate PDF
      const pdfBuffer = await generateInvoicePdf(html, invoiceNo);

      //Upload to Cloudinary
      const uploaded = await uploadInvoice(pdfBuffer, invoiceNo);

      //Save Invoice in Order
      orderData.invoice = {
        invoiceNo: invoiceNo,
        invoice_url: uploaded.secure_url,
      };

      orderData.payment = true;
      await orderData.save();

      //Reduce Product Stock
      for (const item of orderData.items) {
        await productModel.findByIdAndUpdate(item._id, {
          $inc: { quantity: -item.quantity },
        });
      }

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true, msg: "Order Placed" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, msg: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

//placing order using Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: "false",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toLocaleUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, msg: error });
      } else {
        res.json({ success: true, order });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

//verify razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const orderData = await orderModel.findById(orderInfo.receipt);

      //Prepare Invoice Data
      const invoiceNo = `INV-${uuidv4().slice(0, 8).toUpperCase()}`;

      const subtotal = orderData.items.reduce(
        (sum, item) => sum + item.sellprice * item.quantity,
        0
      );

      const gst = +(subtotal * 0.18).toFixed(2);
      const total = subtotal + gst;
      const grandtotal = subtotal + delivery_charges
      const totalInWords = amountInWords(grandtotal)

      const address = orderData.address;

      //Generate Invoice HTML
      const html = invoiceTemplate({
        logoUrl: logoDataUrl,
        order: orderData,
        invoiceNo,
        invoiceDate: new Date().toLocaleDateString(),
        customer: {
          name: address.firstName + " " + address.lastName,
          address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        },
        items: orderData.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.sellprice,
        })),
        subtotal,
        gst,
        delivery_charges,
        total,
        amountWords: totalInWords,
      });

      //Generate PDF
      const pdfBuffer = await generateInvoicePdf(html, invoiceNo);

      //Upload to Cloudinary
      const uploaded = await uploadInvoice(pdfBuffer, invoiceNo);

      //Save Invoice in Order
      orderData.invoice = {
        invoiceNo: invoiceNo,
        invoice_url: uploaded.secure_url,
      };

      orderData.payment = true;
      await orderData.save();

      //Reduce Product Stock
      for (const item of orderData.items) {
        await productModel.findByIdAndUpdate(item._id, {
          $inc: { quantity: -item.quantity },
        });
      }
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true, msg: "Order Placed" });
    }
    if (orderInfo.status !== "paid") {
      await orderModel.findByIdAndDelete(orderInfo.receipt);
      return res.json({ success: false, msg: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

//all orders data admin panel
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    if (!orders) {
      return res.json({ success: false, msg: "No Orders" });
    }
    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });
    if (!orders) {
      return res.json({ success: false, msg: "Orders Not found" });
    }
    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

//update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, msg: "Status Updated" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

const userOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;
    
    const orderData = await orderModel.findById(orderId);

    if (!orderData) {
      return res.json({ success: false, msg: "Order not found" });
    }

    res.json({ success: true, status: orderData.status});
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};

const OrderInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;
    if (!orderId) {
      return res.json({ success: false, msg: "Missing Details" });
    }

    const orderData = await orderModel.findById(orderId);
    if (!orderData) {
      return res.json({ success: false, msg: "Order details not found" });
    }
    const invoice = orderData.invoice;
    return res.json({ success: true, invoice });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
};



export {
  placeOrderCOD,
  placeOrderStripe,
  placeOrderRazorpay,
  getAllOrders,
  userOrders,
  updateOrderStatus,
  verifyStripePayment,
  verifyRazorpayPayment,
  OrderInvoice,
  userOrderStatus,
};
