import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: String,
    createAt: Date,
    expirestAt: Date,
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", OTPSchema);

export { OTP };
