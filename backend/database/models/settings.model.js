import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    companyName: {
      type: String,
      trim: true,
      // minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    taxId: {
      type: String,
      trim: true,
      // minlength: [5, "Tax ID must be at least 5 characters"],
      maxlength: [20, "Tax ID cannot exceed 20 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    paperSize: {
      type: String,
      enum: {
        values: ["A4", "Letter"],
        message: "Paper size must be either A4 or Letter",
      },
      default: "A4",
    },
    defaultInvoiceTemplate: {
      type: String,
      trim: true,
      default: "Modern",
    },
    showCompanyDetails: {
      type: Boolean,
      default: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
// schema.index({ userId: 1 });
schema.index({ createdAt: -1 });

// Pre-save middleware to format phone number
schema.pre("save", function (next) {
  if (this.isModified("phoneNumber")) {
    this.phoneNumber = this.phoneNumber.replace(/\s+/g, "");
  }
  next();
});

schema.post("init", (doc) => {
  doc.image = "http://localhost:3000/uploads/" + doc.image;
});

export const settingsModel = mongoose.model("setting", schema);
