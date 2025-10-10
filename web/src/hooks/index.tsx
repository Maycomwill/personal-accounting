import { AuthProvider } from "@/context/auth";
import { DataProvider } from "@/context/data";
import { type ReactNode } from "react";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  );
}
