import useAuth from "@/hooks/useAuth";
import LoginForm from "./login_form";
import Loading from "./loading";
import clsx from "clsx";

function HomeLogOut() {
  const { loading } = useAuth();
  return (
    <div className="font-sans relative flex items-center justify-start pt-32 flex-col space-y-2 min-h-screen">
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loading size={164} />
        </div>
      )}
      <div className={clsx({ "blur-[4px] opacity-50": loading })}>
        <div className="bg-gradient-to-tr from-blue-500 via-cyan-500 to-cyan-300 bg-clip-text text-transparent">
          <h1 className="font-display text-4xl text-center">
            Personal Accounting
          </h1>
        </div>
        <div className="w-full items-center justify-center px-4 text-center">
          <span className="text-center">
            Manipule suas finanças de maneira simples e rápida
          </span>
        </div>
        <div className="w-full px-4 mt-20">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default HomeLogOut;
