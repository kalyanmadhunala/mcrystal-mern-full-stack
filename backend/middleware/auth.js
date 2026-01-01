// middleware/auth.mjs
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const requireAuth = async (req, res, next) =>  {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split?.(" ")?.[1];
    if (!token) return res.status(401).json({ success: false, msg: "Authentication required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) return res.status(401).json({ success: false, msg: "Invalid token" });

    const user = await userModel.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, msg: "User not found" });

    req.currentUser = user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err.message);
    return res.status(401).json({ success: false, msg: "Authentication failed" });
  }
}


export default requireAuth;
