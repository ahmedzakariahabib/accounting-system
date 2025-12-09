import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema({
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
  totalPrice: {
    type: Number,
    min: [0, "Total price cannot be negative"],
  },
});

const schema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
      default: Date.now,
    },
    items: {
      type: [purchaseItemSchema],
      required: [true, "Purchase items are required"],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "At least one item is required",
      },
    },
    subtotal: {
      type: Number,
      min: [0, "Subtotal cannot be negative"],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      default: 0,
    },
    taxRate: {
      type: Number,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
      default: 0,
    },
    taxAmount: {
      type: Number,
      min: [0, "Tax amount cannot be negative"],
      default: 0,
    },
    totalAmount: {
      type: Number,
      min: [0, "Total amount cannot be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Ordered", "Received", "Cancelled"],
      default: "Draft",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
schema.index({ supplierName: "text" });
schema.index({ purchaseDate: -1 });
schema.index({ createdAt: -1 });
schema.index({ status: 1 });

schema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      item.totalPrice = item.quantity * item.unitPrice;
    });

    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const amountAfterDiscount = this.subtotal - (this.discount || 0);

    this.taxAmount = (amountAfterDiscount * (this.taxRate || 0)) / 100;

    this.totalAmount = amountAfterDiscount + this.taxAmount;
  }
  next();
});

// Pre-update middleware to recalculate amounts
schema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // If items, discount, or taxRate are being updated, recalculate
  if (
    update.items ||
    update.discount !== undefined ||
    update.taxRate !== undefined
  ) {
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (docToUpdate) {
      const items = update.items || docToUpdate.items;
      const discount =
        update.discount !== undefined ? update.discount : docToUpdate.discount;
      const taxRate =
        update.taxRate !== undefined ? update.taxRate : docToUpdate.taxRate;

      // Calculate item totals
      if (items && items.length > 0) {
        items.forEach((item) => {
          item.totalPrice = item.quantity * item.unitPrice;
        });

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        update.subtotal = subtotal;

        // Calculate amount after discount
        const amountAfterDiscount = subtotal - discount;

        // Calculate tax amount
        const taxAmount = (amountAfterDiscount * taxRate) / 100;
        update.taxAmount = taxAmount;

        // Calculate final total
        update.totalAmount = amountAfterDiscount + taxAmount;
      }
    }
  }

  next();
});

export const purchasesModel = mongoose.model("purchase", schema);
