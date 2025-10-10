import { DataContext, type DataContextProps } from "@/context/data";
import { useContext } from "react";

export default function useData(): DataContextProps {
  const context = useContext(DataContext);
  return context;
}
