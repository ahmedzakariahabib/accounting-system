// ===============================
// نوع حالة الدفع / حالة الفاتورة
// ===============================
export type PurchaseStatus =
  | "Ordered"
  | "Received"
  | "Cancelled";


// ===============================
// بيانات عناصر الفاتورة
// ===============================
export interface PurchaseItem {
  _id?: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total?: number; 
}


// ===============================
// بيانات المورد
// ===============================
export interface SupplierInfo {
  _id: string;
  name: string;
  phone: string;
  email: string;
}


// ===============================
// شكل الفاتورة الراجعة من الباك
// ===============================
export interface Purchase {
  [x: string]: number;
  _id: string;
  invoiceNumber: string;
  supplierName: string; // لاحظ: الباك يرجع اسم المورد فقط
  items: PurchaseItem[];
  taxRate: number;
  discount: number;
  status: PurchaseStatus;
  purchaseDate: string;
  grandTotal: number;
  notes?: string;
}


// ===============================
// البيانات المطلوبة للإضافة (POST)
// ===============================
export interface NewPurchaseFormValues {
  supplierName: string;  // Name, not ID
  purchaseDate: string;
  taxRate: number;
  discount: number;
  notes?: string;
  status: PurchaseStatus;
  items: {
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];
}


// ===============================
// جدول العرض
// ===============================
export type TableColumn = {
  key: string;
  label: string;
};

export interface InvoiceTableProps {
  columns: TableColumn[];
}

export interface InvoiceTableContentProps {
  rows: Purchase[];
  columns: TableColumn[];
}

export interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}


// ===============================
// Headers عربية
// ===============================
export type TableHeader = {
  label: string;
  arabic: string;
};


// ===============================
// منتج إضافي
// ===============================
export type Product = {
  name: string;
  quantity: number;
  price: number;
};
