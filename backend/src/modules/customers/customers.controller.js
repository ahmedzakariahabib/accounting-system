import { customersModel } from "../../../database/models/customers.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const addCustomer = catchError(async (req, res, next) => {
  const existingCustomer = await customersModel.findOne({
    phone: req.body.phone,
  });
  if (existingCustomer) {
    return next(new AppError("Phone number already registered", 409));
  }
  if (req.body.email) {
    const existingEmail = await customersModel.findOne({
      email: req.body.email,
    });
    if (existingEmail) {
      return next(new AppError("Email already registered", 409));
    }
  }
  const customer = new customersModel(req.body);
  await customer.save();

  res.status(201).json({
    message: "Customer created successfully",
    customer,
  });
});

const getAllCustomers = catchError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const query = {};

  // Search by name or phone
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [customers, total] = await Promise.all([
    customersModel
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    customersModel.countDocuments(query),
  ]);

  res.json({
    message: "success",
    data: {
      customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getSingleCustomer = catchError(async (req, res, next) => {
  const customer = await customersModel.findById(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }
  res.json({
    message: "success",
    customer,
  });
});

const updateCustomer = catchError(async (req, res, next) => {
  const customer = await customersModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }
  res.json({
    message: "Customer updated successfully",
    customer,
  });
});

const deleteCustomer = catchError(async (req, res, next) => {
  const customer = await customersModel.findByIdAndDelete(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }
  res.json({
    message: "Customer deleted successfully",
    customer,
  });
});

export {
  addCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
