import React from "react";
import { AuthProvider } from "./AuthProvider";
import { UsersProvider } from "./UsersContext";
import { SettingsProvider } from "./SettingsContext";
import { AppThemeProvider } from "./ThemeProvider";
import { ResetPasswordProvider } from "./ResetPasswordContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ResetPasswordProvider>
        <UsersProvider>
            <SettingsProvider>
              <AppThemeProvider>{children}</AppThemeProvider>
            </SettingsProvider>
        </UsersProvider>
      </ResetPasswordProvider>
    </AuthProvider>
  );
}
