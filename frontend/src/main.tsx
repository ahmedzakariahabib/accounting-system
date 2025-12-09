import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { AppThemeProvider } from "./context/ThemeProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("❌ Root element not found! تأكد إن عندك <div id='root'></div> في index.html");
}

// ✅ تشغيل التطبيق
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppThemeProvider>

    <App />
    </AppThemeProvider>
  </React.StrictMode>
);
