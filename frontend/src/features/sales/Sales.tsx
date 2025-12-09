import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TableColumn } from "../../types/sales";
import SalesTable from "./SalesTable";

const tableColumns: TableColumn[] = [
  { key: "invoiceNumber", label: "sales.table.invoiceNumber" },
  { key: "customer", label: "sales.table.customer" },
  { key: "amount", label: "sales.table.amount" },
  { key: "date", label: "sales.table.date" },
  { key: "status", label: "sales.table.status" },
  { key: "action", label: "sales.table.action" },
];

export default function Sales() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        {/* 🔹 Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-text">
            {t("sales.title")}
          </h1>

          <Link
            to="/sales/new"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/90"
          >
            <FaPlus className="text-lg" />
            {t("sales.newSale")}
          </Link>
        </div>

        {/* 🔸 جدول المبيعات */}
          <SalesTable columns={tableColumns} />
      </div>
    </main>
  );
}
