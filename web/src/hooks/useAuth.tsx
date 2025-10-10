import { AuthContext, type AuthContextProps } from "../context/auth.tsx";
import { useContext } from "react";

export default function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  return context;
}
