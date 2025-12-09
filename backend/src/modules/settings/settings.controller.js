import { settingsModel } from "../../../database/models/settings.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";

const getSettings = catchError(async (req, res, next) => {
  let settings = await settingsModel.findOne({ userId: req.user._id });

  // If no settings exist, create default settings
  if (!settings) {
    settings = new settingsModel({
      userId: req.user._id,
      companyName: "",
      address: "",
      phoneNumber: "",
      email: "",
      taxId: "",
      image: null,
      paperSize: "A4",
      defaultInvoiceTemplate: "Modern",
      showCompanyDetails: true,
      darkMode: false,
    });
    await settings.save();
  }

  res.json({
    message: "success",
    settings,
  });
});

const updateSettings = catchError(async (req, res, next) => {
  if (req.body.email) {
    const existingEmail = await settingsModel.findOne({
      email: req.body.email,
      userId: { $ne: req.user._id },
    });
    if (existingEmail) {
      return next(new AppError("Email already registered", 409));
    }
  }

  if (req.file) {
    req.body.image = req.file.filename;
  }
  let settings = await settingsModel.findOne({ userId: req.user._id });

  if (!settings) {
    // Create new settings if they don't exist
    settings = new settingsModel({
      userId: req.user._id,
      ...req.body,
    });
    await settings.save();
  } else {
    // Update existing settings
    settings = await settingsModel.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  res.json({
    message: "Settings updated successfully",
    settings,
  });
});

export { getSettings, updateSettings };
