"use client";
import server from "@/api/server";
import { LoginResponse, User, VerifyResponse } from "@/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import { verify } from "crypto";
import { createContext, ReactNode, useEffect, useState } from "react";

export interface AuthContextProps {
  logged: boolean;
  login: (email: string, password: string, reminder: boolean) => void;
  logout: () => void;
  loading: boolean;
  user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    verify_token();
  }, []);

  async function verify_token() {
    const token = window.localStorage.getItem("token");
    if (!token)
      return (
        setLogged(false),
        setUser(undefined),
        window.localStorage.removeItem("token")
      );

    try {
      const server_response: AxiosResponse<VerifyResponse> = await server.post(
        "/v1/auth/verify",
        { token }
      );

      setUser(server_response.data.user);
      setLogged(true);
      setLoading(false);
      return;
    } catch (error) {
      if (error instanceof AxiosError) {
        setUser(undefined);
        setLogged(false);
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
      console.log(server_response.data);
      window.localStorage.setItem("token", server_response.data.token);
      setUser(server_response.data.data);
      setLogged(true);
      location.reload();
      return;
    } catch (error) {
      if (error instanceof AxiosError) {
        window.localStorage.removeItem("token");
        setLogged(false);
        setLoading(false);
        return;
      }
    }
  }

  function logout() {}
  return (
    <AuthContext.Provider value={{ user, logged, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
