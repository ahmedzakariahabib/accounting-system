import { Link } from 'react-router-dom'
import type { TableColumn } from '../types/sales';
import CustomersTable from '../features/customers/CustomersTable';
import { Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const tableColumns:TableColumn[] = [
  { key: "mName", label: "number" },
  { key: "ContactNumber", label: "Amount" },
  { key: "contactemail", label: "Email" },
  { key: "totalPurchases", label: "payment" },
  { key: "date", label: "Date" },
  { key: "actions", label: "Action" },
];
export default function Customers() {
  const { t } = useTranslation();
  return (<>
    <main className="flex-1 p-6 bg-background">
      <div className="w-full mx-auto max-w-7xl">
    {/* PageHeading */}
    <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Users size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {t("customers.title")}
              </h1>
              <p className="mt-1 text-muted">
                {t("customers.subtitle")}
              </p>
            </div>
          </div>
          
          <Link 
            to="/customers/new" 
            className="flex items-center gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary/90 w-fit"
          >
            <Plus size={20} />
            <span>{t("customers.addSupplier")}</span>
          </Link>
        </div>
      </div>



<CustomersTable  columns={tableColumns}/>

  </div>
</main>

  </>)
}
