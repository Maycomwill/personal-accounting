"use client";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { loading, login } = useAuth();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login(email, password, remember);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-y-4 flex-col items-start justify-center w-full">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 w-full outline-none rounded-sm h-10 px-2 ring-2 ring-transparent focus-within:ring-cyan-500 text-white placeholder:text-white/20 "
          type="email"
          name="email"
          id="email"
          placeholder="Ex: john.doe@example.com"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/5 w-full outline-none rounded-sm h-10 px-2 ring-2 ring-transparent focus-within:ring-cyan-500 text-white placeholder:text-white/20 "
          type="password"
          name="password"
          id="password"
          placeholder="********"
        />
      </div>
      <div className="flex items-center w-full justify-between mt-2">
        <label htmlFor="remember">
          <input
            checked={remember}
            onChange={() => setRemember(!remember)}
            type="checkbox"
            name="remember"
            id="remember"
            className="accent-cyan-500 "
          />{" "}
          Lembrar de mim
        </label>
        <button
          className="uppercase text-lg p-2  bg-white/5 font-display rounded-lg"
          type="submit"
          disabled={loading}
        >
          <div
            className={clsx(
              "bg-gradient-to-tr from-blue-500 via-cyan-500 to-cyan-300 bg-clip-text text-transparent"
            )}
          >
            login
          </div>
        </button>
      </div>
      <div className="w-full flex items-center justify-between mt-4">
        <a
          href="#"
          className="text-white/60 hover:underline underline-offset-3 hover:text-cyan-500 transition-colors duration-100 ease-in-out text-sm"
        >
          Esqueci minha senha
        </a>
        <a
          href="#"
          className="text-white/60 hover:underline underline-offset-3 hover:text-cyan-500 transition-colors duration-100 ease-in-out text-sm"
        >
          Criar minha conta
        </a>
      </div>
    </form>
  );
}
