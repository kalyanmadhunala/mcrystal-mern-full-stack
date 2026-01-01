import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import dns from "dns";
import util from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../config/nodemailer.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const disposableDomains = JSON.parse(
  fs.readFileSync(
    new URL(
      "../node_modules/disposable-email-domains/index.json",
      import.meta.url
    )
  )
);

const resolveMx = util.promisify(dns.resolveMx);

const checkMX = async (email) => {
  const domain = email.split("@")[1];
  try {
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch (err) {
    return console.log(err.message);
  }
};

const isDisposable = (email) => {
  const domain = email.split("@")[1].toLowerCase();
  return disposableDomains.includes(domain);
};

//sluglify
const formatName = (slug) => {
  if (!slug) return "there";
  return slug.replace(/\b\w/g, (char) => char.toUpperCase());
};

//Send verification OTP to email
const sendOTP = async (user) => {
  try {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpiresAt = Date.now() + 5 * 60 * 1000; //5mins from current time

    await user.save();
    const logoUrl = process.env.LOGO_URL;
    //sending otp to email
    const mailOptions = {
      from: {
        name: "M Crystal",
        address: process.env.STORE_MAIL,
      },
      to: user.email,
      subject: "Account verification OTP",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your M Crystal Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7ff; font-family: 'Poppins', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7ff; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 54px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Gradient Background -->
          <tr>
            <td style="background: linear-gradient(135deg, #102d4b 20%, #3e6faa 100%); padding: 50px 30px; text-align: center; color: white;">
              <img src="${logoUrl}" style="height: 100px; width: 360px;" />
              <p style="margin: 12px 0 0; font-size: 18px; opacity: 0.95; letter-spacing: 5px;">DESIGN THAT DEFINES</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center;">
              <h2 style="margin: 0 0 20px; font-size: 26px; color: #2d3748; font-weight: 600;">
              Hi! ${formatName(user.name)} 👋
              </h2>
              <p style="font-size: 17px; color: #555555; line-height: 1.6; margin: 0 0 30px;">
                Welcome to M Crystal! Kindly verify your email <strong style="color: #6e8efb;">${
                  user.email
                }</strong> to complete your registration.
              </p>

              <!-- OTP Card -->
              <div style="background-color: #3e6faa; margin: 30px auto; padding: 30px; border-radius: 16px; max-width: 380px; box-shadow: 0 15px 35px #b3bcc7;">
                <p style="margin: 0 0 15px; color: #ffffff; font-size: 17px; opacity: 0.9;">
                  Your verification code is:
                </p>
                <div style="background-color: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 2px dashed rgba(255,255,255,0.3); border-radius: 12px; padding: 20px; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="margin: 20px 0 0; color: #ffffff; font-size: 15px; opacity: 0.9;">
                  This code expires in <strong>5 minutes</strong>.
                </p>
              </div>

              <p style="font-size: 16px; color: #718096; line-height: 1.6; margin: 30px 0 0;">
                Please enter this code in the app to verify your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #4c8fe0; color: white; padding: 30px 40px; text-align: center; font-size: 14px;">
              <p style="margin: 0; opacity: 0.9;">
                © 2026 M Crystal. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; font-size: 13px; opacity: 0.8;">
                Need help? Contact us at <a href="mailto:mcrystalstore@gmail.com" style="color: #ffffff; text-decoration: underline;">support@mcrystal.com</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- Small print -->
        <table role="presentation" width="600" style="max-width: 600px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; color: #a0aec0; font-size: 12px;">
              <p style="margin: 0;">
                This is an automated message, please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    return error.message;
  }
};

const resetSendOTP = async (user) => {
  try {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpiresAt = Date.now() + 5 * 60 * 1000; //10mins from current time
    user.deleteAfter = undefined;

    await user.save();

    const logoUrl = process.env.LOGO_URL;
    //sending otp to email
    const mailOptions = {
      from: {
        name: "M Crystal",
        address: process.env.STORE_MAIL,
      },
      to: user.email,
      subject: "Password Reset Request",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your M Crystal Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7ff; font-family: 'Poppins', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7ff; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 54px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Gradient Background -->
          <tr>
            <td style="background: linear-gradient(135deg, #102d4b 20%, #3e6faa 100%); padding: 50px 30px; text-align: center; color: white;">
              <img src="${logoUrl}" style="height: 100px; width: 360px;" />
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center;">
              <h2 style="margin:0 0 20px; font-size:26px; color:#000000; font-weight:600;">
  Secure Your Account
</h2>
<p style="font-size:17px; color:#718096; line-height:1.6; margin:0 0 30px;">
  We received a request to reset the password for your M Crystal account linked to <strong style="color:#6e8efb;">${user.email}</strong>.<br>
  Please verify your email to proceed.
</p>

              <!-- OTP Card -->
              <div style="background-color: #3e6faa; margin: 30px auto; padding: 30px; border-radius: 16px; max-width: 380px; box-shadow: 0 15px 35px #b3bcc7;">
                <p style="margin: 0 0 15px; color: #ffffff; font-size: 17px; opacity: 0.9;">
                  Your verification code is:
                </p>
                <div style="background-color: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 2px dashed rgba(255,255,255,0.3); border-radius: 12px; padding: 20px; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="margin: 20px 0 0; color: #ffffff; font-size: 15px; opacity: 0.9;">
                  This code expires in <strong>5 minutes</strong>.
                </p>
              </div>

              <p style="font-size: 16px; color: #718096; line-height: 1.6; margin: 30px 0 0;">
                Please enter this code in the app to verify your email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #4c8fe0; color: white; padding: 30px 40px; text-align: center; font-size: 14px;">
              <p style="margin: 0; opacity: 0.9;">
                © 2026 M Crystal. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; font-size: 13px; opacity: 0.8;">
                Need help? Contact us at <a href="mailto:mcrystalstore@gmail.com" style="color: #ffffff; text-decoration: underline;">support@mcrystal.com</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- Small print -->
        <table role="presentation" width="600" style="max-width: 600px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; color: #a0aec0; font-size: 12px;">
              <p style="margin: 0;">
                This is an automated message, please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    return error.message;
  }
};

const userExists = async (req, res) => {
  const { email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists && exists.verified) {
      return res.json({ success: false, msg: "User already exists" });
    }
    if (exists && !exists.verified) {
      return res.json({ success: false });
    }
    res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

//Route for user register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, msg: "Missing details" });
  }

  try {
    //validator email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, msg: "Please enter valid email" });
    }

    //checking email domain
    const mxValid = await checkMX(email);
    if (!mxValid) {
      return res.json({ success: false, msg: "Email domain does not exist" });
    }

    //checking disposal emails
    if (isDisposable(email)) {
      return res
        .status(400)
        .json({ success: false, msg: "Temporary emails are not allowed" });
    }

    //checking password length
    if (password.length < 8) {
      return res.json({ success: false, msg: "Please enter strong password" });
    }

    //generating salt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //check user exists or not
    const exists = await userModel.findOne({ email });

    if (exists && exists.verified) {
      return res.json({ success: false, msg: "User already exists!" });
    }

    if (exists && !exists.verified) {
      const user = exists;
      try {
        //Calling sendOTP
        sendOTP(user);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 10 * 60 * 1000,
        });
        return res.json({
          success: true,
          msg: "OTP Sent successfully to your email",
        });
      } catch (error) {
        return res.json({ success: false, msg: error.message });
      }
    }

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });

    const user = await newUser.save();

    try {
      //Calling sendOTP
      sendOTP(user);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 10 * 60 * 1000,
      });
      res.json({ success: true, msg: "OTP Sent successfully to your email" });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

// Route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, msg: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });

    //user not found
    if (!user) {
      return res.json({ success: false, msg: "User doesn't exist" });
    }

    //user unverified
    if (!user.verified) {
      return res.json({
        success: false,
        msg: "Your last Registration was incomplete.Signup again after 10 minutes.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    //password mismatch
    if (!isMatch) {
      return res.json({ success: false, msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, msg: "Logged in successfully" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

//verify Sign up OTP
const verifyUserOTP = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, msg: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    if (user.verifyOTP === "" || user.verifyOTP !== otp) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }

    if (user.verifyOTPExpiresAt < Date.now()) {
      user.verifyOTP = "";
      user.verifyOTPExpiresAt = 0;
      await user.save();
      return res.json({ success: false, msg: "OTP Expired!" });
    }

    user.verified = true;
    user.verifyOTP = "";
    user.verifyOTPExpiresAt = 0;
    user.deleteAfter = undefined;

    await user.save();

    const logoUrl = process.env.LOGO_URL;

    const mailOptions = {
      from: {
        name: "M Crystal",
        address: process.env.STORE_MAIL,
      },
      to: user.email,
      subject: "Welcome to M Crystal",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to M Crystal Message</title>
</head>
<body style="margin:0;padding:0;background:#f9f7f5;font-family:'Inter',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9f7f5;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:52px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
          
          <!-- Elegant Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#d4af87 20%,#f5e6d3 100%);padding:70px 40px;text-align:center;color:#2c1e16;">
              <img src="${logoUrl}" style="height: 100px; width: 360px;" />
            </td>
          </tr>

          <!-- Welcome Section -->
          <tr>
            <td style="padding:60px 50px 40px;text-align:center;">
              <h2 style="margin:0 0 20px;font-size:32px;color:#2c1e16;font-weight:500;">
                Welcome home, ${formatName(user.name)} 
              </h2>
              <p style="font-size:18px;color:#555;line-height:1.7;margin:0 0 35px;">
                Your account is now verified and ready.<br>
                Step into a world where every piece is crafted to turn your home into a living gallery.
              </p>

              <!-- Success Badge -->
<div style="text-align:center; margin:35px 0;">
  <div style="
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:12px;
    padding:16px 42px;
    background:#d4af87;
    color:#2c1e16;
    font-size:18px;
    font-weight:600;
    border-radius:60px;
    box-shadow:0 10px 30px rgba(212,175,135,0.4);
    letter-spacing:0.5px;
  ">
    <!-- Green Check Circle -->
    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" style="flex-shrink:0;">
      <circle cx="12" cy="12" r="11" stroke="none"/>
      <path d="M7 12.5l3 3 7-7" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>

    <span>Account Verified Successfully</span>
  </div>
</div>

              <!-- Main CTA -->
              <div style="margin:45px 0;">
                <a href="http://localhost:5173/"
                   style="display:inline-block;padding:18px 48px;background:#2c1e16;color:#fff;font-size:18px;font-weight:600;text-decoration:none;border-radius:50px;box-shadow:0 12px 35px rgba(44,30,22,0.3);">
                  Explore Our Collections
                </a>
              </div>

              <p style="font-size:19px;color:#444;line-height:1.8;margin:40px 0 0;font-weight:300;">
                Discover artistic marble and ceramic pieces that transform everyday spaces
                into timeless works of art.
              </p>
            </td>
          </tr>

          <!-- Highlight Benefits -->
          <!-- Highlight Benefits 100% Responsive -->
<tr>
  <td style="padding:40px 20px 60px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <!-- Item 1 -->
        <td align="center" valign="top" style="padding:15px;">
          <div style="width:90px;height:90px;background:#fdf8f3;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:38px;">
            Home
          </div>
          <p style="margin:0 0 8px;font-weight:600;color:#2c1e16;font-size:16px;line-height:1.4;">
            Artisanal Craftsmanship
          </p>
          <p style="margin:0;color:#777;font-size:14px;line-height:1.5;max-width:200px;margin:0 auto;">
            Every piece shaped by master artisans
          </p>
        </td>

        <!-- Item 2  Lifetime Care -->
        <td align="center" valign="top" style="padding:15px;">
          <div style="width:90px;height:90px;background:#fdf8f3;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:38px;">
            Shield
          </div>
          <p style="margin:0 0 8px;font-weight:600;color:#2c1e16;font-size:16px;line-height:1.4;">
            Lifetime Care
          </p>
          <p style="margin:0;color:#777;font-size:14px;line-height:1.5;max-width:200px;margin:0 auto;">
            Guaranteed quality for generations
          </p>
        </td>

        <!-- Item 3  7-Day Returns -->
        <td align="center" valign="top" style="padding:15px;">
          <div style="width:90px;height:90px;background:#fdf8f3;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:38px;">
            Return
          </div>
          <p style="margin:0 0 8px;font-weight:600;color:#2c1e16;font-size:16px;line-height:1.4;">
            7-Day Return Policy
          </p>
          <p style="margin:0;color:#777;font-size:14px;line-height:1.5;max-width:200px;margin:0 auto;">
            Hassle-free returns within 7 days
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
          <!-- Footer -->
          <tr>
            <td style="background:#2c1e16;color:#e0d6cb;padding:50px 40px;text-align:center;">
              <p style="margin:0;font-size:17px;opacity:0.95;">
                Thank you for bringing timeless beauty into your home.
              </p>
              <p style="margin:25px 0 0;font-size:28px;font-weight:300;letter-spacing:1px;">
                Your home deserves M Crystal
              </p>
              <p style="margin:35px 0 0;font-size:14px;opacity:0.8;">
                © 2026 M Crystal • Handcrafted with passion
              </p>
            </td>
          </tr>
        </table>

        <!-- Sub-footer -->
        <table role="presentation" width="600" style="max-width: 600px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; color: #a0aec0; font-size: 12px;">
              <p style="margin: 0;">
                This is an automated message, please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions);
    res.json({ success: true, msg: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

const verifyUserResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, msg: "Missing details" });
  }
  if (otp.length < 6) {
    return res.json({ success: false, msg: "Enter 6 digits OTP" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (user.resetOTP === "" || user.resetOTP !== otp) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }

    if (user.resetOTPExpiresAt < Date.now()) {
      user.resetOTP = "";
      user.resetOTPExpiresAt = 0;
      user.deleteAfter = undefined;
      await user.save();
      return res.json({ success: false, msg: "OTP Expired!" });
    }

    user.resetOTP = "";
    user.resetOTPExpiresAt = 0;
    user.deleteAfter = undefined;

    await user.save();

    res.json({ success: true, msg: "OTP Verified" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

//send reset password OTP
const sendResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, msg: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    // Proceed to send OTP
    await resetSendOTP(user);

    return res.json({
      success: true,
      msg: "OTP Sent successfully to your email",
    });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

const userData = async (req, res) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.json({ success: false, msg: "Unauthorized user" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    return res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    return res.json({ success: false, msg: error });
  }
};

//verify and reset OTP and set newPassword
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.json({ success: false, msg: "Missing Details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    //checking match with previous password
    const isMatch = await bcrypt.compare(newPassword, user.password);

    if (isMatch) {
      return res.json({
        success: false,
        msg: "New password cannot be same as old",
      });
    }

    //generating salt
    const salt = await bcrypt.genSalt(10);

    //hashing password
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    user.resetOTP = "";
    user.resetOTPExpiresAt = 0;
    user.deleteAfter = undefined;

    await user.save();

    res.json({ success: true, msg: "Password has been reset successfully" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

//logout
const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, msg: "Logged out Successfully" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (user.addresses.length === 0) {
      return res.json({success:false})
    }
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = req.body;

    if (!address) {
      return res.json({ success: false, msg: "Address data missing" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    // Handle default address safely
    if (address.isDefault === true) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // First address auto-default
    if (user.addresses.length === 0) {
      address.isDefault = true;
    }

    user.addresses.push(address);
    user.deleteAfter = undefined
    await user.save();

    res.json({
      success: true,
      addresses: user.addresses,
      msg: "Address added successfully",
    });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};



export {
  loginUser,
  registerUser,
  verifyUserOTP,
  logoutUser,
  sendResetOTP,
  resetPassword,
  userExists,
  userData,
  verifyUserResetOTP,
  addAddress,
  getAddresses,
};
