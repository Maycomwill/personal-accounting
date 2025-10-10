import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa";
import { Button } from "./ui/button";
import useData from "@/hooks/useData";
import type { Category } from "@/interfaces";
import { useEffect } from "react";

function Home() {
  const { loading, logout } = useAuth();
  const { getCategories, categories, loading: data_loading } = useData();

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div>
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
      <div>
        <h1>Dashboard</h1>
        <div className={clsx("block", { invisible: data_loading })}>
          {categories.map((category: Category, index: number) => {
            return <p key={index}>{category.name}</p>;
          })}
        </div>
        <div className="flex gap-4 items-center">
          <button className="bg-white/10 p-4 rounded-full hover:bg-cyan-500 transition-colors duration-150 ease-in-out cursor-pointer hover:shadow-md">
            <FaPlus className="size-8" />
          </button>
          <Button variant={"secondary"} size={"lg"}>
            Criar categoria
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
