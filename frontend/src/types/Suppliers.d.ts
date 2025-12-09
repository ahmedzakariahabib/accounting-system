export interface Supplier {
  [x: string]: string;
  _id?: string; // من MongoDB
  id?: string; // في حالة توليد ID محلي
  name: string; // اسم المورد
  company: string; // اسم الشركة
  contactNumber: string; // رقم التواصل
  email?: string; // البريد الإلكتروني (اختياري)
  address?: string; // العنوان
  createdAt?: string; // تاريخ الإنشاء
  updatedAt?: string; // آخر تحديث
  __v?: number; // من الـ mongoose
}


export interface InvoicePhon {
  id: number; // رقم تسلسلي لكل سجل
  invoiceNumber?: string; // اسم الشركة
  customer: string; // اسم العميل
  amount: string; // المبلغ (مثال: "$150.00")
  date: string; // تاريخ الشراء بصيغة ISO
  phoneNumber: string; // رقم الهاتف العشوائي
}
interface InvoiceTableContentPropsPhon {
  rows: Invoice[]; // <-- خليها من نوع Invoice اللي فيه phoneNumber
  columns: { key: string; label?: string }[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
}


export interface Invoices {
  [x: string]: ReactNode;
  _id: number;
  name: string;
  company: string;
  contactNumber: string;
  updatedAt: string;
  totalPurchases: string;
  // contactNumber: number;
  // status: 'Paid' | 'Pending' | 'Overdue';
}
