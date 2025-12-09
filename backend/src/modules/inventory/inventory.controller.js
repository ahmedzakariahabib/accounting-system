import { inventoryModel } from "../../../database/models/inventory.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const addInventoryItem = catchError(async (req, res, next) => {
  // Check if SKU already exists (if provided)
  if (req.body.sku) {
    const existingSKU = await inventoryModel.findOne({ sku: req.body.sku });
    if (existingSKU) {
      return next(new AppError("SKU already exists", 409));
    }
  }

  const item = new inventoryModel(req.body);
  await item.save();

  res.status(201).json({
    message: "Inventory item created successfully",
    item,
  });
});

const getAllInventoryItems = catchError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    status,
    sortBy = "createdAt",
    order = "desc",
    supplier,
  } = req.query;

  const query = {};

  // Search by item name, SKU, or color
  if (search) {
    query.$or = [
      { itemName: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
      { color: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by category
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  // Filter by supplier
  if (supplier) {
    query.supplier = supplier;
  }

  // Filter by stock status
  if (status) {
    if (status === "Out of Stock") {
      query.quantity = 0;
    } else if (status === "Low Stock") {
      query.$expr = {
        $and: [
          { $gt: ["$quantity", 0] },
          { $lte: ["$quantity", "$lowStockThreshold"] },
        ],
      };
    } else if (status === "In Stock") {
      query.$expr = { $gt: ["$quantity", "$lowStockThreshold"] };
    }
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    inventoryModel
      .find(query)
      .populate("supplier", "name phone email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    inventoryModel.countDocuments(query),
  ]);

  // Add virtual fields to lean results
  const itemsWithVirtuals = items.map((item) => {
    let stockStatus = "In Stock";
    if (item.quantity === 0) stockStatus = "Out of Stock";
    else if (item.quantity <= item.lowStockThreshold) stockStatus = "Low Stock";

    return {
      ...item,
      stockStatus,
    };
  });

  res.json({
    message: "success",
    data: {
      items: itemsWithVirtuals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getSingleInventoryItem = catchError(async (req, res, next) => {
  const item = await inventoryModel
    .findById(req.params.id)
    .populate("supplier", "name phone email address");

  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  res.json({
    message: "success",
    item,
  });
});

const updateInventoryItem = catchError(async (req, res, next) => {
  // Check if updating SKU and if it already exists
  if (req.body.sku) {
    const existingSKU = await inventoryModel.findOne({
      sku: req.body.sku,
      _id: { $ne: req.params.id },
    });
    if (existingSKU) {
      return next(new AppError("SKU already exists", 409));
    }
  }

  const item = await inventoryModel
    .findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate("supplier", "name phone email");

  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  res.json({
    message: "Inventory item updated successfully",
    item,
  });
});

const updateInventoryQuantity = catchError(async (req, res, next) => {
  const { quantity, operation } = req.body;

  const item = await inventoryModel.findById(req.params.id);
  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  // Validate operation
  if (operation === "subtract" && item.quantity < quantity) {
    return next(
      new AppError(
        `Insufficient stock. Available quantity: ${item.quantity}`,
        400
      )
    );
  }

  await item.updateStock(quantity, operation);

  res.json({
    message: "Inventory quantity updated successfully",
    item,
  });
});

const deleteInventoryItem = catchError(async (req, res, next) => {
  const item = await inventoryModel.findByIdAndDelete(req.params.id);
  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  res.json({
    message: "Inventory item deleted successfully",
    item,
  });
});

const getInventoryStats = catchError(async (req, res, next) => {
  const [totalItems, lowStockItems, outOfStockItems, totalValue] =
    await Promise.all([
      inventoryModel.countDocuments(),
      inventoryModel.countDocuments({
        $expr: {
          $and: [
            { $gt: ["$quantity", 0] },
            { $lte: ["$quantity", "$lowStockThreshold"] },
          ],
        },
      }),
      inventoryModel.countDocuments({ quantity: 0 }),
      inventoryModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
      ]),
    ]);

  const categoryStats = await inventoryModel.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json({
    message: "success",
    stats: {
      totalItems,
      lowStockItems,
      outOfStockItems,
      inStockItems: totalItems - outOfStockItems,
      totalInventoryValue: totalValue[0]?.total || 0,
      categoryBreakdown: categoryStats,
    },
  });
});

export {
  addInventoryItem,
  getAllInventoryItems,
  getSingleInventoryItem,
  updateInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem,
  getInventoryStats,
};
