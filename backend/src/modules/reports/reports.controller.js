import { catchError } from "../../middleware/catchError.js";
import { salesModel } from "../../../database/models/sales.model.js";
import { inventoryModel } from "../../../database/models/inventory.model.js";

// Helper function to get date range based on period
const getDateRange = (period, startDate, endDate) => {
  const now = new Date();
  let start, end;

  switch (period) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "week":
      start = new Date(now.setDate(now.getDate() - 7));
      end = new Date();
      break;
    case "month":
      start = new Date(now.setMonth(now.getMonth() - 1));
      end = new Date();
      break;
    case "quarter":
      start = new Date(now.setMonth(now.getMonth() - 3));
      end = new Date();
      break;
    case "year":
      start = new Date(now.setFullYear(now.getFullYear() - 1));
      end = new Date();
      break;
    case "custom":
      start = startDate ? new Date(startDate) : new Date(0);
      end = endDate ? new Date(endDate) : new Date();
      break;
    default:
      start = new Date(now.setMonth(now.getMonth() - 1));
      end = new Date();
  }

  return { start, end };
};

// تقرير المبيعات حسب التاريخ
const getSalesReport = catchError(async (req, res, next) => {
  const { period = "month", groupBy = "day", startDate, endDate } = req.query;
  const { start, end } = getDateRange(period, startDate, endDate);

  // Build aggregation pipeline
  const pipeline = [
    {
      $match: {
        saleDate: { $gte: start, $lte: end },
      },
    },
    {
      $unwind: "$items", // Unwind items array to access individual items
    },
    {
      $group: {
        _id: {
          invoiceId: "$_id",
          date:
            groupBy === "day"
              ? { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } }
              : null,
        },
        grandTotal: { $first: "$grandTotal" }, // Get invoice grand total once
        totalQuantity: { $sum: "$items.quantity" }, // Sum quantities from items
        invoiceNumber: { $first: "$invoiceNumber" },
        paymentStatus: { $first: "$paymentStatus" },
      },
    },
    {
      $group: {
        _id: "$_id.date",
        totalSales: { $sum: "$grandTotal" },
        totalQuantity: { $sum: "$totalQuantity" },
        transactionCount: { $sum: 1 },
        averageTransaction: { $avg: "$grandTotal" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const salesData = await salesModel.aggregate(pipeline);

  // Calculate summary statistics
  const summary = {
    totalRevenue: salesData.reduce((sum, item) => sum + item.totalSales, 0),
    totalTransactions: salesData.reduce(
      (sum, item) => sum + item.transactionCount,
      0
    ),
    totalQuantitySold: salesData.reduce(
      (sum, item) => sum + item.totalQuantity,
      0
    ),
    averageTransactionValue:
      salesData.length > 0
        ? salesData.reduce((sum, item) => sum + item.averageTransaction, 0) /
          salesData.length
        : 0,
  };

  res.json({
    message: "Sales report retrieved successfully",
    data: {
      period: { start, end },
      summary,
      details: salesData,
    },
  });
});

// تقرير الأرباح والخسائر (صافي الربح الشهري)
const getProfitReport = catchError(async (req, res, next) => {
  const { period = "month", startDate, endDate } = req.query;

  const { start, end } = getDateRange(period, startDate, endDate);

  // Calculate total revenu e and cost from sales
  const revenueData = await salesModel.aggregate([
    {
      $match: {
        saleDate: { $gte: start, $lte: end },
      },
    },
    {
      $unwind: "$items", // Unwind items array
    },
    {
      $group: {
        _id: "$_id",
        grandTotal: { $first: "$grandTotal" }, // Get total once per invoice
        totalCost: {
          $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] }, // Calculate cost from items
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$grandTotal" },
        totalCost: { $sum: "$totalCost" },
      },
    },
  ]);

  const revenue = revenueData[0]?.totalRevenue || 0;
  const cost = revenueData[0]?.totalCost || 0;
  const grossProfit = revenue - cost;

  res.json({
    message: "Profit report retrieved successfully",
    data: {
      period: { start, end },
      revenue: revenue.toFixed(2),
      cost: cost.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
    },
  });
});

// تقرير حركة الأصناف والمخزون
const getInventoryReport = catchError(async (req, res, next) => {
  const {
    lowStock = false,
    category,
    sortBy = "itemName",
    order = "asc",
  } = req.query;

  const query = {};

  // Filter by low stock
  if (lowStock === "true") {
    query.$expr = { $lte: ["$quantity", "$lowStockThreshold"] };
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  const sortOrder = order === "asc" ? 1 : -1;
  const sortField = sortBy === "value" ? "totalValue" : sortBy;

  const products = await inventoryModel
    .find(query)
    .sort({ [sortField]: sortOrder })
    .lean();

  // Calculate inventory value and statistics
  const inventoryStats = products.reduce(
    (acc, product) => {
      const productValue = product.quantity * product.price;
      acc.totalValue += productValue;
      acc.totalItems += product.quantity;

      // Check if stock is low
      if (product.quantity <= product.lowStockThreshold) {
        acc.lowStockItems.push({
          itemName: product.itemName,
          sku: product.sku,
          quantity: product.quantity,
          lowStockThreshold: product.lowStockThreshold,
          shortage: product.lowStockThreshold - product.quantity,
          category: product.category,
        });
      }
      return acc;
    },
    { totalValue: 0, totalItems: 0, lowStockItems: [] }
  );

  res.json({
    message: "Inventory report retrieved successfully",
    data: {
      summary: {
        totalProducts: products.length,
        totalInventoryValue: inventoryStats.totalValue.toFixed(2),
        totalItems: inventoryStats.totalItems,
        lowStockCount: inventoryStats.lowStockItems.length,
      },
      lowStockItems: inventoryStats.lowStockItems,
      products: products.map((p) => ({
        id: p._id,
        itemName: p.itemName,
        sku: p.sku,
        category: p.category,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
        lowStockThreshold: p.lowStockThreshold,
        price: p.price,
        totalValue: (p.quantity * p.price).toFixed(2),
        lastRestocked: p.lastRestocked,
      })),
    },
  });
});

// ملخص التقارير العامة (Dashboard Charts)
const getSummaryReport = catchError(async (req, res, next) => {
  const { period = "month" } = req.query;

  const { start, end } = getDateRange(period);

  // Get sales summary
  const salesSummary = await salesModel.aggregate([
    {
      $match: {
        saleDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$grandTotal" }, // Use grandTotal from invoice
        totalTransactions: { $sum: 1 },
        averageTransaction: { $avg: "$grandTotal" },
      },
    },
  ]);

  // Get payment status breakdown
  const paymentStatusBreakdown = await salesModel.aggregate([
    {
      $match: {
        saleDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$grandTotal" },
      },
    },
  ]);

  res.json({
    message: "Summary report retrieved successfully",
    data: {
      period: { start, end },
      sales: salesSummary[0] || {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0,
      },
      paymentStatus: paymentStatusBreakdown,
    },
  });
});

export {
  getSalesReport,
  getProfitReport,
  getInventoryReport,
  getSummaryReport,
};
