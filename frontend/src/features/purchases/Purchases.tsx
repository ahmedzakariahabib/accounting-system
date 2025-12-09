import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TableColumn } from "../../types/sales";
import PurchasesTable from "./purchasesTable";

const tableColumns: TableColumn[] = [
  { key: "invoiceNumber", label: "purchasess.table.invoiceNumber" },
  { key: "supplier", label: "purchasess.table.supplier" },
  { key: "amount", label: "purchasess.table.amount" },
  { key: "date", label: "purchasess.table.date" },
  { key: "status", label: "purchasess.table.status" },
  { key: "action", label: "purchasess.table.action" },
];

export default function PurchasesPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-text">{t("purchases")}</h1>

          <Link
            to="/purchases/new"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/90"
          >
            <FaPlus className="text-lg" />
            {t("purchasess.newPurchase")}
          </Link>
        </div>

        {/* Table */}
        <PurchasesTable columns={tableColumns} />
      </div>
    </main>
  );
}
