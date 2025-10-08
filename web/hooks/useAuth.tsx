import { AuthContext, AuthContextProps } from "@/context";
import { useContext } from "react";

export default function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  return context;
}
