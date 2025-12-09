// ======================================
// ✅ أنواع الفواتير العامة (Invoices)
// ======================================

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

// ======================================
// ✅ حالة الدفع (Enum)
// ======================================

// ✅ Union Type للحالات
export type PaymentStatus = 
  | "Paid"
  | "Pending"
  | "Overdue"


// ✅ باقي النوع
export interface NewInvoiceFormValues {
  customer: string;
  saleDate: string;
  taxRate: number;
  discount: number;
  items: {
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  paymentStatus: PaymentStatus;
}


// ======================================
// ✅ أنواع المبيعات (Sales)
// ======================================

export interface CustomerInfo {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

export interface SaleItem {
  _id?: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total?: number; // اختياري لأن الواجهة تحسبه
}

export interface Sale {
  taxAmount: number;
  _id: string;
  invoiceNumber: string;
  customer: CustomerInfo;
  items: SaleItem[];
  taxRate: number;
  discount: number;
  paymentStatus: PaymentStatus;
  saleDate: string;
  grandTotal: number;
  notes?: string;
}


// ======================================
// ✅ أنواع الجدول والعرض
// ======================================

export type TableColumn = {
  key: string;
  label: string;
};

export interface InvoiceTableProps {
  columns: TableColumn[];
}

export interface InvoiceTableContentProps {
  rows: Sale[];
  columns: TableColumn[];
}

export interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// ======================================
// ✅ Headers للواجهة بالعربية
// ======================================

export type TableHeader = {
  label: string;
  arabic: string;
};

// ======================================
// ✅ أنواع إضافية (للمنتجات)
// ======================================

export type Product = {
  name: string;
  quantity: number;
  price: number;
};
