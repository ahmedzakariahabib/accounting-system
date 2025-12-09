export interface Customer {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: string;
  lastPurchaseDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface supplier {
  id?: number;
  name: string;
  email?: string;
  totalPurchases: string;
  updatedAt: Data;
  contactNumber: string;
  company:string;
  lastPurchaseDate: string;

 
}