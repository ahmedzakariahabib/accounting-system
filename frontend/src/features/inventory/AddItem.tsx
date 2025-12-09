import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ItemForm from "./ItemForm";
import { api } from "../../services/axios";
import { addInventoryItem } from "../../services/api/inventory";

export default function AddItem() {
  const navigate = useNavigate();

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await api.get("/api/v1/suppliers");
      return res.data.data.suppliers;
    },
  });

  const initialValues = {
    itemName: "",
    category: "",
    supplier: "",
    size: "",
    color: "",
    quantity: 0,
    price: 0,
    lowStockThreshold: 0,
    sku: "",
  };

  const handleSubmit = async (values: any, formikHelpers: any) => {
    try {
      await addInventoryItem(values);
      navigate("/inventory");
    } catch (error: any) {
      console.error("Save failed:", error);
      formikHelpers.setSubmitting(false);
      alert(error.response?.data?.message || "Error while saving item");
    }
  };

  return (
    <main className="p-6">

      <ItemForm
        suppliers={suppliers}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
