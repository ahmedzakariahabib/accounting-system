import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleTheme: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() =>
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  // تحديث Tailwind + localStorage لما الوضع يتغير
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // إنشاء الثيم الخاص بـ MUI بناءً على الوضع الحالي
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#00897b" },
          background: {
            default: mode === "dark" ? "#121212" : "#f9f9f9",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f5f5f5" : "#1e1e1e",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
