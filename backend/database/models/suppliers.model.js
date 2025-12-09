import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Supplier name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    company: {
      type: String,
      trim: true,
      required: [true, "Company name is required"],
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    contactNumber: {
      type: String,
      trim: true,
      required: [true, "Contact number is required"],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
// schema.index({ contactNumber: 1 });
schema.index({ name: 1 });
schema.index({ company: 1 });
schema.index({ email: 1 });
schema.index({ createdAt: -1 });

// Virtual for supplier tier
schema.virtual("supplierTier").get(function () {
  if (this.totalPurchases === 0) return "New";
  if (this.totalPurchases < 10000) return "Bronze";
  if (this.totalPurchases < 50000) return "Silver";
  if (this.totalPurchases < 100000) return "Gold";
  return "Platinum";
});

// Pre-save middleware to format contact number
schema.pre("save", function (next) {
  if (this.isModified("contactNumber")) {
    this.contactNumber = this.contactNumber.replace(/\s+/g, "");
  }
  next();
});

export const suppliersModel = mongoose.model("supplier", schema);
