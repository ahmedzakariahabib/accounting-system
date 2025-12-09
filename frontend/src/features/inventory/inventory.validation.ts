import * as Yup from "yup";

export const inventorySchema = Yup.object().shape({
  itemName: Yup.string().required("Item name is required"),
  category: Yup.string().required("Category is required"),
  supplier: Yup.string().required("Supplier is required"),
  size: Yup.string().required("Size is required"),
  color: Yup.string().required("Color is required"),
  quantity: Yup.number().min(0).required("Quantity is required"),
  price: Yup.number().min(0).required("Price is required"),
  lowStockThreshold: Yup.number().min(0).required("Low stock threshold is required"),
  sku: Yup.string().required("SKU is required"),
});
