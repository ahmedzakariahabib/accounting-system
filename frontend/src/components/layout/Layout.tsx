import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div
      className="flex min-h-screen 
                 bg-[var(--color-background)] 
                 text-[var(--color-text)] 
                 transition-colors duration-300"
    >
      {/* الشريط الجانبي */}
      <Sidebar />

      {/* المحتوى الرئيسي */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <main
          className="flex-1 overflow-y-auto p-6 md:p-8 
                     bg-[var(--color-background)] 
                     text-[var(--color-text)]"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
