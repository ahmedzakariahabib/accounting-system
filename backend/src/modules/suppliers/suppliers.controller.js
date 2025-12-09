import { suppliersModel } from "../../../database/models/suppliers.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const addSupplier = catchError(async (req, res, next) => {
  const existingSupplier = await suppliersModel.findOne({
    contactNumber: req.body.contactNumber,
  });
  if (existingSupplier) {
    return next(new AppError("Contact number already registered", 409));
  }

  if (req.body.email) {
    const existingEmail = await suppliersModel.findOne({
      email: req.body.email,
    });
    if (existingEmail) {
      return next(new AppError("Email already registered", 409));
    }
  }

  const supplier = new suppliersModel(req.body);
  await supplier.save();

  res.status(201).json({
    message: "Supplier created successfully",
    supplier,
  });
});

const getAllSuppliers = catchError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { contactNumber: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [suppliers, total] = await Promise.all([
    suppliersModel
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    suppliersModel.countDocuments(query),
  ]);

  res.json({
    message: "success",
    data: {
      suppliers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getSingleSupplier = catchError(async (req, res, next) => {
  const supplier = await suppliersModel.findById(req.params.id);
  if (!supplier) {
    return next(new AppError("Supplier not found", 404));
  }
  res.json({
    message: "success",
    supplier,
  });
});

const updateSupplier = catchError(async (req, res, next) => {
  // Check if updating contact number and if it's already taken
  if (req.body.contactNumber) {
    const existingSupplier = await suppliersModel.findOne({
      contactNumber: req.body.contactNumber,
      _id: { $ne: req.params.id },
    });
    if (existingSupplier) {
      return next(new AppError("Contact number already registered", 409));
    }
  }

  // Check if updating email and if it's already taken
  if (req.body.email) {
    const existingEmail = await suppliersModel.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id },
    });
    if (existingEmail) {
      return next(new AppError("Email already registered", 409));
    }
  }

  const supplier = await suppliersModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!supplier) {
    return next(new AppError("Supplier not found", 404));
  }

  res.json({
    message: "Supplier updated successfully",
    supplier,
  });
});

const deleteSupplier = catchError(async (req, res, next) => {
  const supplier = await suppliersModel.findByIdAndDelete(req.params.id);
  if (!supplier) {
    return next(new AppError("Supplier not found", 404));
  }
  res.json({
    message: "Supplier deleted successfully",
    supplier,
  });
});

// const updateSupplierPurchases = catchError(async (req, res, next) => {
//   const { amount } = req.body;

//   const supplier = await suppliersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       $inc: { totalPurchases: amount },
//       lastPurchaseDate: new Date(),
//     },
//     { new: true, runValidators: true }
//   );

//   if (!supplier) {
//     return next(new AppError("Supplier not found", 404));
//   }

//   res.json({
//     message: "Supplier purchases updated successfully",
//     supplier,
//   });
// });

export {
  addSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
};
