import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "../../context/ThemeProvider";

export const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          transition: "all 0.3s ease",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
        }}
      >
        {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </IconButton>
    </Tooltip>
  );
};
