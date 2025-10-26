import { useState, type FormEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import { Spinner } from "./ui/spinner";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { loading, register } = useAuth();
  function handlePasswordVisible() {
    return setPasswordVisible(!passwordVisible);
  }

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    register(email, name, password, confirmPassword);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    return;
  }
  return (
    <div className="bg-gradient-to-b from-slate-950 to-black text-white w-full min-h-screen flex flex-col">
      <div className="w-full flex items-center pt-24 flex-col min-h-screen">
        <div className="bg-gradient-to-tr from-blue-500 via-cyan-500 to-cyan-300 bg-clip-text text-transparent">
          <h1 className="font-display text-3xl text-center">Crie uma conta</h1>
        </div>
        <span className="px-4 text-center">
          Você precisa de poucos dados para se cadastrar em nossa plataforma.
        </span>
        <form
          onSubmit={handleRegister}
          className={clsx("w-full pt-12 px-2 flex flex-col space-y-4", {
            hidden: loading,
          })}
        >
          <div className="flex flex-col space-y-2 justify-start flex-start">
            <Label htmlFor="name-input">Nome:</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              type="text"
              name="name-input"
              placeholder="John Doe"
            />
          </div>
          <div className="flex flex-col space-y-2 justify-start flex-start">
            <Label htmlFor="email-input">Email:</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              name="email-input"
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="flex flex-col space-y-2 justify-start flex-start">
            <Label htmlFor="password-input">Senha:</Label>
            <div className="relative">
              <Input
                minLength={8}
                required
                value={password}
                min={8}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordVisible ? "text" : "password"}
                name="password-input"
                id="password-input"
                placeholder="********"
              />
              {passwordVisible ? (
                <div className="absolute right-3 opacity-50 -translate-y-1/2 top-1/2">
                  <EyeIcon onClick={handlePasswordVisible} />
                </div>
              ) : (
                <EyeOffIcon
                  className="absolute right-3 opacity-50 -translate-y-1/2 top-1/2"
                  onClick={handlePasswordVisible}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2 justify-start flex-start">
            <Label htmlFor="repassword-input">Confirme a senha:</Label>
            <div className="relative">
              <Input
                minLength={8}
                required
                value={confirmPassword}
                min={8}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={passwordVisible ? "text" : "password"}
                name="repassword-input"
                id="repassword-input"
                placeholder="********"
              />
              {passwordVisible ? (
                <div className="absolute right-3 opacity-50 -translate-y-1/2 top-1/2">
                  <EyeIcon onClick={handlePasswordVisible} />
                </div>
              ) : (
                <EyeOffIcon
                  className="absolute right-3 opacity-50 -translate-y-1/2 top-1/2"
                  onClick={handlePasswordVisible}
                />
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <Button
              className="uppercase text-lg p-2 py-6 bg-white/5 hover:bg-white/10 font-display focus-visible:ring-cyan-500 focus-visible:ring-2 outline-none rounded-lg"
              type={"submit"}
              variant={"secondary"}
            >
              <span
                className={clsx(
                  "bg-gradient-to-tr from-blue-500 via-cyan-500 to-cyan-300 bg-clip-text text-transparent",
                  { "opacity-50": loading }
                )}
              >
                Registrar
              </span>
            </Button>
          </div>
        </form>
        <div className="fixed bottom-10">
          <Button
            variant={"link"}
            onClick={() => {
              location.replace("/");
            }}
          >
            Voltar
          </Button>
        </div>
      </div>
      <div
        className={clsx(
          "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2",
          { hidden: !loading }
        )}
      >
        <Spinner className="text-cyan-500 size-124" />
      </div>
    </div>
  );
}

export default RegisterPage;
