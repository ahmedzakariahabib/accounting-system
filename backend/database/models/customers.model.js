import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Customer name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    totalPurchases: {
      type: Number,
      default: 0,
      min: [0, "Total purchases cannot be negative"],
    },
    lastPurchaseDate: {
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
// schema.index({ phone: 1 });
schema.index({ name: 1 });
schema.index({ email: 1 });
schema.index({ createdAt: -1 });

// Virtual for customer status
schema.virtual("customerStatus").get(function () {
  if (this.totalPurchases === 0) return "New";
  if (this.totalPurchases < 5) return "Regular";
  if (this.totalPurchases < 20) return "Loyal";
  return "VIP";
});

// Pre-save middleware to format phone number
schema.pre("save", function (next) {
  if (this.isModified("phone")) {
    this.phone = this.phone.replace(/\s+/g, "");
  }
  next();
});

export const customersModel = mongoose.model("customer", schema);
