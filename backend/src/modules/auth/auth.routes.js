import express from "express";
import {
  allowedTo,
  protectedRoutes,
  resetUserPassword,
  sendOtp,
  sendPasswordResetOTPEmail,
  sendVerificationOTPEmail,
  signin,
  signup,
  verifyOTP,
  verifyUserEmail,
} from "./auth.controller.js";
import { signinVal, signupVal } from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import { checkEmail } from "../../middleware/checkEmail.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  protectedRoutes,
  allowedTo("admin"),
  validation(signupVal),
  checkEmail,
  signup
);
authRouter.post("/signin", validation(signinVal), signin);
authRouter.post("/send-otp", async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;
    const otpRecord = await sendOtp({ email, subject, message, duration });
    res.json({ message: "OTP sent successfully", otpRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});
authRouter.post("/verrify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const ValidOTP = await verifyOTP({ email, otp });

    res.json({ valid: ValidOTP });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify OTP", error: error.message });
  }
});

authRouter.post("/email_verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw Error("email is required");
    }

    const createEmailVerificationOTP = await sendVerificationOTPEmail(email);

    res.status(200).json({
      message: "verification OTP sent successfully",
      data: createEmailVerificationOTP,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/email_verification/verify", async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!(email && otp)) {
      throw Error("Empty otp details are not allowed");
    }
    await verifyUserEmail({ email, otp });

    res.status(200).json({ email, verified: true });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw Error("email is required");
    }

    const createdPasswordResetOTP = await sendPasswordResetOTPEmail(email);
    res.status(200).json({ createdPasswordResetOTP });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!(email && otp && newPassword)) {
      throw Error("Empty credentials are not allowed");
    }

    await resetUserPassword({ email, otp, newPassword });
    res.status(200).json({ email, passwordreset: true });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default authRouter;
