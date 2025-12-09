import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../../src/utils/AppError.js";
import { OTP } from "../../../database/models/otp.model.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendEmail } from "../../services/sendemail.js";
import { styleOTP } from "../../services/styleOTP.js";
// ---------------------- SIGNUP ----------------------
const signup = catchError(async (req, res) => {
  let user = new userModel(req.body);
  await user.save();
  await sendVerificationOTPEmail(user.email);
  res.json({ message: "success", user });
});

// ---------------------- SIGNIN ----------------------
const signin = catchError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    if (!user.verified) {
      return next(
        new AppError("email not verified. please verify your email", 401)
      );
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ message: "success", token, user });
  }
  next(new AppError("incorrect email or password", 401));
});

// ---------------------- SEND OTP ----------------------
const sendOtp = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error("provide all required fields");
    }
    await OTP.deleteOne({ email });
    const otp = generateOTP();
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject,
      html: styleOTP(message, duration, otp),
    };

    await sendEmail(mailOptions);

    const hashedOTP = await bcrypt.hash(otp, 10);
    const newOtp = new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + duration * 60 * 60 * 1000,
    });

    const createdOTPRecord = await newOtp.save();
    return createdOTPRecord;
  } catch (error) {
    throw error;
  }
};

// ---------------------- VERIFY OTP ----------------------

const verifyOTP = async ({ email, otp }) => {
  console.log(email, otp);
  try {
    if (!(email && otp)) {
      throw Error("provide all required fields");
    }

    const matchedOTPRecord = await OTP.findOne({ email });

    if (!matchedOTPRecord) {
      throw Error("no OTP record found");
    }
    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("OTP expired");
    }

    const isOTPValid = await bcrypt.compare(otp, matchedOTPRecord.otp);
    return isOTPValid;
  } catch (error) {
    throw error;
  }
};
// ---------------------- DELETE OTP ----------------------

const deleteOTP = async (email) => {
  try {
    await OTP.deleteOne({ email });
  } catch (error) {
    throw error;
  }
};

// ---------------------- EMAIL VERIFICATION ----------------------

const sendVerificationOTPEmail = async (email) => {
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      throw Error("user with this email does not exist");
    }

    const otpDetails = {
      email,
      subject: "Email Verification",
      message: "verify your email with the code below.",
      duration: 1,
    };

    const createdOTP = await sendOtp(otpDetails);
    return createdOTP;
  } catch (error) {
    throw error;
  }
};

// ---------------------- verifyUserEmail ----------------------

const verifyUserEmail = async ({ email, otp }) => {
  try {
    const isValidOTP = await verifyOTP({ email, otp });
    if (!isValidOTP) {
      throw Error("invalid OTP");
    }

    await userModel.updateOne({ email }, { verified: true });

    await deleteOTP(email);
    return;
  } catch (error) {
    throw error;
  }
};
// ---------------------- PASSWORD RESET ----------------------
const sendPasswordResetOTPEmail = async (email) => {
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      throw Error("user with this email does not exist");
    }

    if (!existingUser.verified) {
      throw Error("email not verified. cannot reset password");
    }

    const otpDetails = {
      email,
      subject: "Password Reset OTP",
      message: "reset your password with the code below.",
      duration: 1,
    };
    const createdOTP = await sendOtp(otpDetails);

    return createdOTP;
  } catch (error) {
    throw error;
  }
};
// ---------------------- RESET USER PASSWORD ----------------------

const resetUserPassword = async ({ email, otp, newPassword }) => {
  try {
    const isValidOTP = await verifyOTP({ email, otp });
    if (!isValidOTP) {
      throw Error("invalid OTP,check your inbox and try again");
    }

    if (newPassword.length < 8) {
      throw Error("password must be at least 8 characters long");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne({ email }, { password: hashedPassword });

    await deleteOTP(email);
    return;
  } catch (error) {
    throw error;
  }
};

//authentication
const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  //1.token is exist or not
  if (!token) return next(new AppError("token not provided", 401));
  //2.verify token
  let decoded = jwt.verify(token, process.env.JWT_KEY);
  //3.userId->exist or not
  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new AppError("user not found", 404));
  if (user.passwordChangedAt) {
    //time return with milliseconds i want with seconds because i will compare it with decoded.iat and this time with seconds
    let time = parseInt(user?.passwordChangedAt.getTime() / 1000);
    if (time > decoded.iat)
      return next(new AppError("invalid token..login again", 401));
  }
  req.user = user;
  next();
});
//authorization
const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("you are not authorized."));
    next();
  });
};

export {
  signin,
  signup,
  sendOtp,
  verifyOTP,
  deleteOTP,
  sendVerificationOTPEmail,
  verifyUserEmail,
  sendPasswordResetOTPEmail,
  resetUserPassword,
  protectedRoutes,
  allowedTo,
};
