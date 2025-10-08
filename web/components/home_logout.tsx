import React from "react";
import LoginForm from "./login_form";

function HomeLogOut() {
  return (
    <div className="font-sans flex items-center justify-start pt-48 flex-col space-y-2 min-h-screen">
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
  );
}

export default HomeLogOut;
