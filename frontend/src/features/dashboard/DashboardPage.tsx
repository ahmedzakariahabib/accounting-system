import type { TableColumn } from "../../types/sales";
import InvoiceTable from "../sales/SalesTable";
import { KPI } from "./widgets/KPI";
import { SalesChart } from "./widgets/SalesChart";
const tableColumns:TableColumn[] = [
  { key: "invoice", label: "invoice" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
  { key: "status", label: "Payment Status" },
  { key: "action", label: "Action" },
];

export function DashboardPage() {
  return (
    <main className="p-6 space-y-8">
      <KPI />
      <SalesChart />
      {/* <InvoiceTable /> */}
                      <InvoiceTable columns={tableColumns}/>
      
    </main>
  );
}
