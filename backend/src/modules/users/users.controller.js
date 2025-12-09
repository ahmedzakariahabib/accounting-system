import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const getAllUsers = catchError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    order = "desc",
    role,
  } = req.query;

  const query = {};

  // Search by name, email, or phone
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    userModel
      .find(query)
      .select("-password")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    userModel.countDocuments(query),
  ]);

  res.json({
    message: "success",
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getSingleUser = catchError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.json({
    message: "success",
    user,
  });
});

const updateUser = catchError(async (req, res, next) => {
  if (req.body.email) {
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
    return next(new AppError("User not found", 404));
  }

  res.json({
    message: "User updated successfully",
    user,
  });
});

const deleteUser = catchError(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.json({
    message: "User deleted successfully",
    user,
  });
});

export { getAllUsers, getSingleUser, updateUser, deleteUser };
