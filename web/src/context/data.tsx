import server from "@/api/server";
import type { Category, CategoryListResponse } from "@/interfaces";
import { AxiosError, type AxiosResponse } from "axios";
import { createContext, useState, type ReactNode } from "react";

export type DataContextProps = {
  categories: Category[];
  loading: boolean;
  getCategories: () => void;
};
// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext({} as DataContextProps);

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  async function getCategories() {
    setLoading(true);
    try {
      const server_response: AxiosResponse<CategoryListResponse> =
        await server.get("/v1/category/list");
      setCategories(server_response.data.data);
      setLoading(false);
      console.log(server_response.data.data);
      return;
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoading(false);
        setCategories([]);
        return;
      }
    }
  }

  return (
    <DataContext.Provider value={{ categories, loading, getCategories }}>
      {children}
    </DataContext.Provider>
  );
}
