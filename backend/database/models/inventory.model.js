import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      trim: true,
      required: [true, "Item name is required"],
      minlength: [2, "Item name must be at least 2 characters"],
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is required"],
      minlength: [2, "Category must be at least 2 characters"],
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplier",
      default: null,
    },
    size: {
      type: String,
      trim: true,
      default: null,
    },
    color: {
      type: String,
      trim: true,
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low stock threshold cannot be negative"],
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    lastRestocked: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
schema.index({ itemName: 1 });
schema.index({ category: 1 });
schema.index({ quantity: 1 });
// schema.index({ sku: 1 });
schema.index({ supplier: 1 });
schema.index({ createdAt: -1 });

// Virtual for stock status
schema.virtual("stockStatus").get(function () {
  if (this.quantity === 0) return "Out of Stock";
  if (this.quantity <= this.lowStockThreshold) return "Low Stock";
  return "In Stock";
});

// Virtual for stock level percentage
schema.virtual("stockLevel").get(function () {
  if (this.lowStockThreshold === 0) return 100;
  return Math.min(
    100,
    Math.round((this.quantity / (this.lowStockThreshold * 5)) * 100)
  );
});

// Pre-save middleware to auto-generate SKU if not provided
schema.pre("save", async function (next) {
  if (!this.sku && this.isNew) {
    const count = await this.constructor.countDocuments();
    this.sku = `SKU-${Date.now()}-${count + 1}`;
  }
  next();
});

// Method to update stock quantity
schema.methods.updateStock = function (quantity, operation = "set") {
  if (operation === "add") {
    this.quantity += quantity;
  } else if (operation === "subtract") {
    this.quantity = Math.max(0, this.quantity - quantity);
  } else {
    this.quantity = quantity;
  }

  if (this.quantity > 0) {
    this.lastRestocked = new Date();
  }

  return this.save();
};

export const inventoryModel = mongoose.model("inventory", schema);
