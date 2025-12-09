import { salesModel } from "../../../database/models/sales.model.js";

import { inventoryModel } from "../../../database/models/inventory.model.js";
import { catchError } from "../../middleware/catchError.js";
import { userModel } from "../../../database/models/user.model.js";

// إجماليات المبيعات، الأرباح، المستخدمين، المنتجات
const getSummary = catchError(async (req, res, next) => {
  const { period = "30days" } = req.query;

  // Calculate date range based on period
  let daysAgo = 30;
  if (period === "7days") daysAgo = 7;
  else if (period === "90days") daysAgo = 90;
  else if (period === "year") daysAgo = 365;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  // Total Sales and Revenue
  const salesStats = await salesModel.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Total Users
  const totalUsers = await userModel.countDocuments();

  // Total Products
  const totalProducts = await inventoryModel.countDocuments();

  // Sales Growth (current period vs previous period)
  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(previousStartDate.getDate() - daysAgo);

  const [currentPeriodSales, previousPeriodSales] = await Promise.all([
    salesModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]),
    salesModel.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStartDate, $lt: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]),
  ]);

  const currentPeriod = currentPeriodSales[0]?.total || 0;
  const previousPeriod = previousPeriodSales[0]?.total || 0;
  const growthPercentage =
    previousPeriod > 0
      ? (((currentPeriod - previousPeriod) / previousPeriod) * 100).toFixed(1)
      : 0;

  const summary = {
    totalSales: salesStats[0]?.totalSales || 0,
    totalRevenue: salesStats[0]?.totalRevenue || 0,
    totalUsers: totalUsers || 0,
    totalProducts: totalProducts || 0,
    salesGrowth: `${growthPercentage > 0 ? "+" : ""}${growthPercentage}%`,
    period: period,
  };

  res.status(200).json({
    message: "success",
    data: summary,
  });
});

// آخر 5 عمليات بيع
const getRecentSales = catchError(async (req, res, next) => {
  const { limit = 5 } = req.query;
  const sales = await salesModel
    .find()
    .populate("customer", "name email")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select(
      "invoiceNumber grandTotal paymentStatus createdAt saleDate customer"
    )
    .lean();

  console.log(sales);

  const formattedSales = sales.map((sale) => ({
    id: sale._id,
    invoiceNumber: sale.invoiceNumber,
    totalAmount: sale.grandTotal,
    status: sale.paymentStatus,
    saleDate: sale.saleDate,
    createdAt: sale.createdAt,
    customerName: sale.customer?.name || "N/A",
    customerEmail: sale.customer?.email || "N/A",
  }));

  res.status(200).json({
    message: "success",
    data: {
      sales: formattedSales,
      count: formattedSales.length,
    },
  });
});

export { getSummary, getRecentSales };
