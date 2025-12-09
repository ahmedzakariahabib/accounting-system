import InventoryTable from "../features/inventory/InventoryTable";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Inventory() {
    const { t } = useTranslation();

  return (
    <main>
      <div className="w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className=" dark:text-[#f0f5f5] text-[#101818] text-4xl font-black">
            {t("inventory.title")}
          </p>
          <Link
            to={"new"}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-3 hover:bg-primary/90"
          >
            <span className="text-lg material-symbols-outlined">
              <FaPlus />
            </span>
            <span className="truncate">{t("inventory.addNewItem")}</span>
          </Link>
        </div>

        <InventoryTable
          columns={[
            { key: "itemName", label: "itemName" },
            { key: "category", label: "category" },
            { key: "size", label: "size" },
            { key: "color", label: "color" },
            { key: "price", label: "price" },
            { key: "quantity", label: "quantity" },
            { key: "stockStatus", label: "status" },
            { key: "actions", label: "actions" },
          ]}
        />
      </div>
    </main>
  );
}
