import { salesModel } from "../../../database/models/sales.model.js";
import { customersModel } from "../../../database/models/customers.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const addSale = catchError(async (req, res, next) => {
  const customer = await customersModel.findById(req.body.customer);
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  if (!req.body.invoiceNumber) {
    req.body.invoiceNumber = await salesModel.generateInvoiceNumber();
  }

  const existingInvoice = await salesModel.findOne({
    invoiceNumber: req.body.invoiceNumber,
  });
  if (existingInvoice) {
    return next(new AppError("Invoice number already exists", 409));
  }

  const sale = new salesModel(req.body);
  await sale.save();

  customer.totalPurchases += 1;
  customer.lastPurchaseDate = sale.saleDate;
  await customer.save();

  await sale.populate("customer", "name phone email");

  res.status(201).json({
    message: "Sale created successfully",
    sale,
  });
});

const getAllSales = catchError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    paymentStatus,
    sortBy = "createdAt",
    order = "desc",
    startDate,
    endDate,
  } = req.query;

  const query = {};

  // Search by invoice number or customer name
  if (search) {
    const customers = await customersModel
      .find({ name: { $regex: search, $options: "i" } })
      .select("_id");
    const customerIds = customers.map((c) => c._id);

    query.$or = [
      { invoiceNumber: { $regex: search, $options: "i" } },
      { customer: { $in: customerIds } },
    ];
  }

  // Filter by payment status
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.saleDate = {};
    if (startDate) {
      query.saleDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.saleDate.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [sales, total] = await Promise.all([
    salesModel
      .find(query)
      .populate("customer", "name phone email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    salesModel.countDocuments(query),
  ]);

  res.json({
    message: "success",
    data: {
      sales,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getSingleSale = catchError(async (req, res, next) => {
  const sale = await salesModel
    .findById(req.params.id)
    .populate("customer", "name phone email address");

  if (!sale) {
    return next(new AppError("Sale not found", 404));
  }

  res.json({
    message: "success",
    sale,
  });
});

const updateSale = catchError(async (req, res, next) => {
  // Check if customer exists if being updated
  if (req.body.customer) {
    const customer = await customersModel.findById(req.body.customer);
    if (!customer) {
      return next(new AppError("Customer not found", 404));
    }
  }

  // Check if invoice number is being changed and if it exists
  if (req.body.invoiceNumber) {
    const existingInvoice = await salesModel.findOne({
      invoiceNumber: req.body.invoiceNumber,
      _id: { $ne: req.params.id },
    });
    if (existingInvoice) {
      return next(new AppError("Invoice number already exists", 409));
    }
  }

  const sale = await salesModel
    .findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate("customer", "name phone email");

  if (!sale) {
    return next(new AppError("Sale not found", 404));
  }

  res.json({
    message: "Sale updated successfully",
    sale,
  });
});

const deleteSale = catchError(async (req, res, next) => {
  const sale = await salesModel.findById(req.params.id);

  if (!sale) {
    return next(new AppError("Sale not found", 404));
  }

  // Update customer's total purchases
  const customer = await customersModel.findById(sale.customer);
  if (customer && customer.totalPurchases > 0) {
    customer.totalPurchases -= 1;
    await customer.save();
  }

  await salesModel.findByIdAndDelete(req.params.id);

  res.json({
    message: "Sale deleted successfully",
    sale,
  });
});

// const getSalesStats = catchError(async (req, res, next) => {
//   const stats = await salesModel.aggregate([
//     {
//       $group: {
//         _id: null,
//         totalSales: { $sum: 1 },
//         totalRevenue: { $sum: "$grandTotal" },
//         averageSaleValue: { $avg: "$grandTotal" },
//         paidSales: {
//           $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, 1, 0] },
//         },
//         pendingSales: {
//           $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0] },
//         },
//         overdueSales: {
//           $sum: { $cond: [{ $eq: ["$paymentStatus", "Overdue"] }, 1, 0] },
//         },
//       },
//     },
//   ]);

//   res.json({
//     message: "success",
//     stats: stats[0] || {
//       totalSales: 0,
//       totalRevenue: 0,
//       averageSaleValue: 0,
//       paidSales: 0,
//       pendingSales: 0,
//       overdueSales: 0,
//     },
//   });
// });

export { addSale, getAllSales, getSingleSale, updateSale, deleteSale };
