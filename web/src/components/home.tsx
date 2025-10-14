import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import useData from "@/hooks/useData";
import { useEffect } from "react";
import CreateCategoryDialog from "./create_category_dialog";
import Dashboard from "./dashboard";
import SelectPeriodDialog from "./select_period_dialog";
import CreateTransactionDialog from "./create_transaction_dialog";

function Home() {
  const { loading, logout } = useAuth();
  const { getCategories } = useData();
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col pt-4">
      <div>
        <Dashboard />
        <div className="flex flex-col gap-4 items-center justify-center">
          <CreateTransactionDialog />

          <div className="w-full items-center justify-center ">
            <CreateCategoryDialog />
            <SelectPeriodDialog />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center pt-4">
        <button
          className="uppercase text-lg p-2  bg-white/5 font-display rounded-lg"
          onClick={logout}
        >
          <div
            className={clsx(
              "bg-gradient-to-tr from-blue-500 via-cyan-500 to-cyan-300 bg-clip-text text-transparent",
              loading && "disabled"
            )}
          >
            logout
          </div>
        </button>
      </div>
    </div>
  );
}

export default Home;
