import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ItemForm from "./ItemForm";
import { getInventoryById, updateInventoryItem } from "../../services/api/inventory";
import { api } from "../../services/axios";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isLoading } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => getInventoryById(id!),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await api.get("/api/v1/suppliers");
      return res.data.data.suppliers;
    },
  });

if (isLoading || !item) return <p className="p-6">Loading...</p>;

const initialValues = {
    _id: item._id, // ← ضيف هذا السطر
  itemName: item.itemName,
  category: item.category,
  supplier: item.supplier?._id || "",
  size: item.size,
  color: item.color,
  quantity: item.quantity,
  price: item.price,
  lowStockThreshold: item.lowStockThreshold,
  sku: item.sku,
};


const handleSubmit = async (values: any, formikHelpers: any) => {
  try {
    await updateInventoryItem(id!, values);
    navigate("/inventory");
  } catch (error: any) {
    console.error("Update failed:", error);
    formikHelpers.setSubmitting(false);
    alert(error.response?.data?.message || "Error while updating item");
  }
};


  return (
<main className="p-6">

  <ItemForm
    initialValues={initialValues}
    suppliers={suppliers}
    onSubmit={handleSubmit}
  />
</main>

  );
}
