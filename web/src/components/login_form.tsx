"use client";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { loading, login } = useAuth();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login(email, password, remember);
  }
  function handlePasswordVisible() {
    return setPasswordVisible(!passwordVisible);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-y-4 flex-col items-start justify-center w-full">
        <div className="w-full">
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 w-full outline-none rounded-sm h-10 px-2 ring-2 ring-transparent focus-within:ring-cyan-500 text-white placeholder:text-white/20 "
            type="email"
            name="email"
            id="email"
            placeholder="Ex: john.doe@example.com"
          />
        </div>
        <div className="w-full relative">
          <input
            required
            value={password}
            min={8}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 relative w-full outline-none rounded-sm h-10 px-2 ring-2 ring-transparent focus-within:ring-cyan-500 text-white placeholder:text-white/20 "
            type={passwordVisible ? "text" : "password"}
            name="password"
            id="password"
            placeholder="********"
          />

          {passwordVisible ? (
            <div className="absolute right-3 opacity-50 -translate-y-1/2 top-1/2">
              <EyeIcon onClick={handlePasswordVisible} />
            </div>
          ) : (
            <EyeOffIcon className="absolute right-3 opacity-50 -translate-y-1/2 top-1/2" onClick={handlePasswordVisible} />
          )}
        </div>
      </div>
      <div className="flex items-center w-full justify-between mt-2">
        <label htmlFor="remember">
          <input
            checked={remember}
            onChange={() => setRemember(!remember)}
            type="checkbox"
            name="remember"
            id="remember"
            className="accent-cyan-500 outline-none focus-visible:ring-cyan-500 focus-visible:ring-2"
          />{" "}
          Lembrar de mim
        </label>
        <button
          className="uppercase text-lg p-2 bg-white/5 hover:bg-white/10 font-display focus-visible:ring-cyan-500 focus-visible:ring-2 outline-none rounded-lg"
          type="submit"
          disabled={loading}
        >
          <div
            className={clsx(
              "bg-gradient-to-tr from-blue-500 via-cyan-500 to-cyan-300 bg-clip-text text-transparent",
              { "opacity-50": loading }
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
