import { purchasesModel } from "../../../database/models/purchases.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const addPurchase = catchError(async (req, res, next) => {
  req.body.createdBy = req.user._id;

  const purchase = new purchasesModel(req.body);
  await purchase.save();

  res.status(201).json({
    message: "Purchase created successfully",
    purchase,
  });
});

const getAllPurchases = catchError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    order = "desc",
    startDate,
    endDate,
    status,
  } = req.query;

  const query = {};

  // Search by supplier name
  if (search) {
    query.supplierName = { $regex: search, $options: "i" };
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.purchaseDate = {};
    if (startDate) {
      query.purchaseDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.purchaseDate.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [purchases, total] = await Promise.all([
    purchasesModel
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .lean(),
    purchasesModel.countDocuments(query),
  ]);

  res.json({
    message: "success",
    data: {
      purchases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getSinglePurchase = catchError(async (req, res, next) => {
  const purchase = await purchasesModel
    .findById(req.params.id)
    .populate("createdBy", "name email");

  if (!purchase) {
    return next(new AppError("Purchase not found", 404));
  }

  res.json({
    message: "success",
    purchase,
  });
});

const updatePurchase = catchError(async (req, res, next) => {
  const existingPurchase = await purchasesModel.findById(req.params.id);
  if (!existingPurchase) {
    return next(new AppError("Purchase not found", 404));
  }

  const purchase = await purchasesModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    message: "Purchase updated successfully",
    purchase,
  });
});

const deletePurchase = catchError(async (req, res, next) => {
  const purchase = await purchasesModel.findById(req.params.id);
  if (!purchase) {
    return next(new AppError("Purchase not found", 404));
  }

  await purchasesModel.findByIdAndDelete(req.params.id);

  res.json({
    message: "Purchase deleted successfully",
    purchase,
  });
});

export {
  addPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
};
