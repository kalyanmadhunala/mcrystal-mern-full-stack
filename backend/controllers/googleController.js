// routes/auth.mjs
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Helper: create auth JWT (used for main sessions)
 */
const createAuthToken = (user) => {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Helper: create temp token for setting password (short lived)
 * purpose: 'set_password'
 */

const createSetPasswordToken = (userId) => {
  return jwt.sign({ id: userId, purpose: "set_password" }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

/**
 * POST /api/auth/google
 * Body: { idToken } (id_token from Google Identity Services)
 *
 * Response cases:
 * - { action: "login", ok:true } -> client should redirect to home
 * - { action: "set_password", token: "<tempToken>" } -> redirect to set-password page with token
 * - { success:false, msg } -> error
 */


const googleSigin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, msg: "idToken required" });

    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: googleId, email, email_verified, name, picture } = payload;
    
    if (!email) return res.status(400).json({ success: false, msg: "Google account has no email" });

    // Ensure email is lowercase for comparison
    const normalizedEmail = email.toLowerCase();

    // Find user with this email
    let user = await userModel.findOne({ email: normalizedEmail });

    if (user) {
      // If user exists and already has a password -> log them in (we allow google login to sign them in if email matches)
      if (user.password) {
        // attach googleId if missing and not used by another account
        if (!user.googleId) {
          const conflict = await userModel.findOne({ googleId });
          if (!conflict) {
            user.googleId = googleId;
            if (!user.picture && picture) user.picture = picture;
            if (email_verified) user.verified = true;
            user.deleteAfter = undefined
            await user.save();
          } // else: googleId already linked somewhere else — extremely rare
        }

        const token = createAuthToken(user);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({ action: "login", ok: true });
      }

      // user exists but has NO password -> require them to set a password
      // (create short-lived set-password token)
      const setToken = createSetPasswordToken(user._id);
      return res.json({ action: "set_password", token: setToken });
    } else {
      // user does not exist -> create user and request password set
      // But ensure googleId isn't already linked to other user (very unlikely)
      const byGoogleId = await userModel.findOne({ googleId });
      if (byGoogleId) {
        // Shouldn't happen, but handle gracefully: sign in that user
        const token = createAuthToken(byGoogleId);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ action: "login", ok: true });
      }

      const newUser = new userModel({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        picture,
        verified: !!email_verified,
        deleteAfter: undefined
      });
      await newUser.save();

      // create set-password token so user can set local password (also serves as auth to do it)
      const setToken = createSetPasswordToken(newUser._id);
      return res.status(201).json({ action: "set_password", token: setToken });
    }
  } catch (err) {
    console.error("POST /google/auth error:", err);
    return res.status(500).json({ success: false, msg: "Authentication failed" });
  }
};

/**
 * POST /api/auth/set-password
 * Body: { token, password }
 * - token: temp token from google response (purpose: set_password)
 * - Validate token, set password for user, mark verified:true, then issue real auth cookie and respond success
 */


const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, msg: "token and password required" });
    if (password.length < 8 && password.length > 15) return res.status(400).json({ success: false, msg: "Password too short (min 8 chars)" });

    // verify temp token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
      if (payload.purpose !== "set_password"){
        return res.json({success:false, msg: "Invalid token purpose"})
      }
    } catch (err) {
      return res.status(400).json({ success: false, msg: "Invalid or expired token" });
    }

    const user = await userModel.findById(payload.id);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    // If user already has a password (maybe race condition), simply login them in
    if (user.password) {
      const authToken = createAuthToken(user);
      res.cookie("token", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.json({ success: true, msg: "Already set; logged in" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    user.verified = true; // Google already verified email earlier
    user.deleteAfter = undefined
    await user.save();

    // issue auth cookie
    const authToken = createAuthToken(user);
    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, msg: "Password set successfully" });
  } catch (err) {
    console.error("POST /google/set-password error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};



export {googleSigin, setPassword}
