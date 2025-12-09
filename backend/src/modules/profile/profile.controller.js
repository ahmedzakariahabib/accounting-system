import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const updateProfile = catchError(async (req, res, next) => {
  if (req.body?.role) {
    return next(new AppError("Role cannot be changed via profile update", 400));
  }
  if (req.body?.email) {
    const existingEmail = await userModel.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id },
    });
    if (existingEmail) {
      return next(new AppError("Email already registered", 409));
    }
  }

  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("Profile not found", 404));
  }

  res.json({
    message: "Profile updated successfully",
    user,
  });
});

const changePassword = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    await userModel.findByIdAndUpdate(req.user._id, {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    });
    return res.json({ message: "success", token });
  }

  next(new AppError("incorret email or password", 401));
});

export { updateProfile, changePassword };
