import server from "@/api/server";
import type { LoginResponse, User, VerifyResponse } from "@/interfaces";
import { AxiosError, type AxiosResponse } from "axios";
import { createContext, type ReactNode, useEffect, useState } from "react";

export interface AuthContextProps {
  logged: boolean;
  login: (email: string, password: string, reminder: boolean) => void;
  logout: () => void;
  loading: boolean;
  user: User | undefined;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    verify_token();
  }, []);

  async function verify_token() {
    setLoading(true);
    const token = window.localStorage.getItem("token");
    if (!token)
      return (
        setLogged(false),
        setLoading(false),
        setUser(undefined),
        window.localStorage.removeItem("token")
      );

    try {
      const server_response: AxiosResponse<VerifyResponse> = await server.post(
        "/v1/auth/verify",
        { token }
      );

      return setTimeout(() => {
        setUser(server_response.data.user);
        setLogged(true);
        setLoading(false);
      }, 500);
    } catch (error) {
      if (error instanceof AxiosError) {
        setUser(undefined);
        setLogged(false);
        setLoading(false);
        window.localStorage.removeItem("token");
        return;
      }
    }
  }

  async function login(email: string, password: string, reminder: boolean) {
    setLoading(true);
    if (email === "" || password === "") {
      setLoading(false);
      return alert("Preencha os campos");
    }
    try {
      const server_response: AxiosResponse<LoginResponse> = await server.post(
        "/v1/auth/login",
        {
          email,
          password,
          reminder,
        }
      );
      // console.log(server_response.data);

      return setTimeout(() => {
        window.localStorage.setItem("token", server_response.data.token);
        setUser(server_response.data.data);
        setLogged(true);
        setLoading(false);
        location.reload();
      }, 1500);
    } catch (error) {
      if (error instanceof AxiosError) {
        window.localStorage.removeItem("token");
        setLogged(false);
        setUser(undefined);
        setLoading(false);
        return;
      }
    }
  }

  function logout() {
    setLoading(true);
    window.localStorage.removeItem("token");
    setUser(undefined);
    setLogged(false);
    setLoading(false);
    location.reload();
  }
  return (
    <AuthContext.Provider value={{ user, logged, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
