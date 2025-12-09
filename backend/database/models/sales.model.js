import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: [0, "Unit price cannot be negative"],
  },
  total: {
    type: Number,
    // required: true,
  },
});

const schema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: [true, "Customer is required"],
    },
    items: {
      type: [saleItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "At least one item is required",
      },
    },
    subtotal: {
      type: Number,
      //   required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    taxRate: {
      type: Number,
      default: 5,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
    },
    taxAmount: {
      type: Number,
      //   required: true,
      min: [0, "Tax amount cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    grandTotal: {
      type: Number,
      //   required: true,
      min: [0, "Grand total cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
// schema.index({ invoiceNumber: 1 });
schema.index({ customer: 1 });
schema.index({ paymentStatus: 1 });
schema.index({ saleDate: -1 });
schema.index({ createdAt: -1 });

// Pre-save middleware to calculate totals
schema.pre("save", function (next) {
  // Calculate item totals
  this.items.forEach((item) => {
    item.total = item.quantity * item.unitPrice;
  });

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Calculate tax amount
  this.taxAmount = (this.subtotal * this.taxRate) / 100;

  // Calculate grand total
  this.grandTotal = this.subtotal + this.taxAmount - this.discount;

  next();
});

// Static method to generate invoice number
schema.statics.generateInvoiceNumber = async function () {
  const lastSale = await this.findOne()
    .sort({ createdAt: -1 })
    .select("invoiceNumber");

  if (!lastSale) {
    return "INV-001";
  }

  const lastNumber = parseInt(lastSale.invoiceNumber.split("-")[1]);
  const newNumber = lastNumber + 1;
  return `INV-${String(newNumber).padStart(3, "0")}`;
};

export const salesModel = mongoose.model("sale", schema);
