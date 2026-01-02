import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import googleRouter from "./routes/googleRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";



const allowedOrigins = ["https://mcrystalz.web.app","https://mcrystalz.firebaseapp.com"]
//App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());

//endpoints
app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/health", (req, res) => {
  res.status(200).send("Ok I am fine");
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/account", googleRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use('/order', orderRouter);

app.listen(port, () => {
  console.log("Server started on PORT :" + port);
});
