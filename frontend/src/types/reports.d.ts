export interface SalesData {
  name: string;
  sales: number;
  color: string;
  [key: string]: any; // هذا هو الإصلاح الرئيسي لخطأ TypeScript
}
export interface TabItem {
  id: number;
  title: string;
  salary: number;
  state: number;
}