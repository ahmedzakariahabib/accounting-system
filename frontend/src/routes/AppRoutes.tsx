import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import OtpPage from "../pages/Auth/OtpPage";
import NewSales from "../features/sales/NewSales";
import { MainLayout } from "../components/layout/Layout";
import Dashboard from "../pages/dashboard";
import Sales from "./../pages/sales";
import Purchases from "../pages/Purchases";
import Inventory from "../pages/Inventory";
import AddItem from "../features/inventory/AddItem";
import EditItem from "../features/inventory/EditItem";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import { UserForm } from "../features/users/UserForm";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import { ProtectedRoute } from "./ProtectedRoute";
import Customers from "../pages/Customers";
import NewCustomers from "../features/customers/NewCustomers";
import Suppliers from "../pages/Suppliers";
import EditSuppilers from "../features/suppliers/EditSuppliers";
import NewSuppliers from "../features/suppliers/NewSuppliers";
import Reports from "../pages/Reports";
import EditSale from "../features/sales/EditSales";
import EditCustomer from "../features/customers/EditCustomer";
import NotFound from "../pages/NotFound";
import NewPurchases from "../features/purchases/NewPurchases";
import EditPurchases from "../features/purchases/EditPurchases";
import PurchasePrint from "../features/purchases/PurchasePrint";
import SalesPrint from "../features/sales/SalesPrint";
import EmailVerification from "../pages/Auth/EmailVerification";
import OtpEmailPage from "../pages/Auth/OtpEmailPage";

const router = createBrowserRouter([
  // 🔓 صفحات عامة بدون Layout
  { path: "/", element: <Login /> },
  { path: "/email-verification", element: <EmailVerification /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/otp-email", element: <OtpEmailPage /> },
  { path: "/otp", element: <OtpPage /> },

  // 🔐 صفحات داخل النظام

  {
    element: <MainLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "*", element: <NotFound /> },

      {
        path: "/sales",
        element: (
          <ProtectedRoute allowedRoles={["cashier", "admin", ]}>
            <Sales />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sales/new",
        element: (
          <ProtectedRoute allowedRoles={["cashier", "admin", ]}>
            <NewSales />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sales/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["cashier", "admin", ]}>
            <EditSale />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sales/:id/print",
        element: (
          <ProtectedRoute allowedRoles={["cashier", "admin", ]}>
            <SalesPrint />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchases",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <Purchases />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchases/new",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <NewPurchases />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchases/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <EditPurchases />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchases/:id/print",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <PurchasePrint />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <Inventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory/new",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <AddItem />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["inventory", "admin"]}>
            <EditItem />
          </ProtectedRoute>
        ),
      },

      {
        path: "/customers",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin"]}
          >
            <Customers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customers/new",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin"]}
          >
            <NewCustomers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customers/:ids/edit",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin", ]}
          >
            <EditCustomer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/suppliers",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin", ]}
          >
            <Suppliers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/suppliers/:id/edit",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin", ]}
          >
            <EditSuppilers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/suppliers/new",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin", ]}
          >
            <NewSuppliers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <ProtectedRoute
            allowedRoles={["cashier", "inventory", "admin" ]}
          >
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["admin" ]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/userForm",
        element: (
          <ProtectedRoute allowedRoles={["admin" ]}>
            <UserForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute allowedRoles={["admin" ]}>
            <Settings />
          </ProtectedRoute>
        ),
      },
      { path: "/profile", element: <Profile /> },
      { path: "/changePassword", element: <ChangePassword /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
