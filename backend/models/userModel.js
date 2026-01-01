import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // hashed password; absent if only Google signup so far
    googleId: { type: String, index: true, sparse: true, default: "" },
    picture: { type: String, default: "" },
    verified: { type: Boolean, default: false }, // email verified (Google => true)
    cartData: { type: Object, default: {} },
    addresses: {
      type: [
        {
          firstName: String,
          lastName: String,
          email: String,
          street: String,
          city: String,
          state: String,
          pincode: String,
          country: String,
          phone: String,
          isDefault: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    wishlist: { type: Object, default: {} },
    verifyOTP: { type: String, default: "" },
    verifyOTPExpiresAt: { type: Number, default: 0 },
    resetOTP: { type: String, default: "" },
    resetOTPExpiresAt: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now()},
    // TTL delete after X minutes if user not verified
    deleteAfter: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 min
      index: { expires: 0 },
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("users", userSchema);

export default userModel;
