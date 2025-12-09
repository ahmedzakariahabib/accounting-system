import { createContext, useContext, useState } from "react";

interface ResetContextType {
  email: string;
  otp: string;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
}

const ResetPasswordContext = createContext<ResetContextType | null>(null);

export function ResetPasswordProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <ResetPasswordContext.Provider value={{ email, otp, setEmail, setOtp }}>
      {children}
    </ResetPasswordContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useResetPassword = () => {
  const context = useContext(ResetPasswordContext);
  if (!context)
    throw new Error("useResetPassword must be used within ResetPasswordProvider");
  return context;
};
