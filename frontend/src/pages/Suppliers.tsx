import { Link } from 'react-router-dom'
import SuppliersTable from '../features/suppliers/SuppliersTable'
import { Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';




export default function Suppliers() {
const { t } = useTranslation();

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="w-full mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">
                  {t("suppliers.title")}
                </h1>
                <p className="mt-1 text-muted">
                  {t("suppliers.subtitle")}
                </p>
              </div>
            </div>
            
            <Link 
              to="/suppliers/new" 
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary/90 w-fit"
            >
              <Plus size={20} />
              <span>{t("suppliers.addNewSupplier")}</span>
            </Link>
          </div>
        </div>

        {/* Suppliers Table */}
        <SuppliersTable  />
      </div>
    </main>
  )
}