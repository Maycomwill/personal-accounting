import server from "@/api/server";
import type {
  Category,
  CategoryListResponse,
  ListMonthlyTransactionsResponse,
  Transactions,
} from "@/interfaces";
import { AxiosError, type AxiosResponse } from "axios";
import { createContext, useState, type ReactNode } from "react";
import { toast } from "sonner";

export type DataContextProps = {
  categories: Category[];
  loading: boolean;
  transactions: Transactions | undefined;
  getCategories: () => void;
  createCategory: (name: string) => void;
  createTransaction: ({
    name,
    amount,
    type,
    categoryId,
    date,
  }: {
    name: string;
    amount: number;
    type: string;
    categoryId: string;
    date: Date | undefined;
  }) => void;
  deleteTransaction: ({ type, id }: { type: string; id: string }) => void;
  getTransactions: (period: { month: number; year: number }) => void;
};
// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext({} as DataContextProps);

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transactions>();

  async function getCategories() {
    setLoading(true);
    try {
      const server_response: AxiosResponse<CategoryListResponse> =
        await server.get("/v1/category/list");
      setCategories(server_response.data.data);
      setLoading(false);
      return;
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoading(false);
        setCategories([]);
        return;
      }
    }
  }

  async function createCategory(name: string) {
    setLoading(true);
    try {
      const token = window.localStorage.getItem("token");
      if (!token) return;

      const server_response: AxiosResponse = await server.post(
        "/v1/category/create",
        {
          name,
          token,
        }
      );
      toast.success(server_response.data.message);

      return setTimeout(() => {
        getCategories();
        setLoading(false);
      }, 500);
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoading(false);
        return;
      }
    }
  }

  async function getTransactions(period: { month: number; year: number }) {
    setLoading(true);
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const server_response: AxiosResponse<ListMonthlyTransactionsResponse> =
        await server.get(
          `/v1/transaction/monthly-list?month=${period.month}&year=${period.year}&token=${token}`
        );
      setTransactions({
        expenses: server_response.data.data.transactions.expenses,
        incomings: server_response.data.data.transactions.incomings,
        period: {
          month: server_response.data.data.period.month,
          year: server_response.data.data.period.year,
        },
      });

      return setTimeout(() => {
        setLoading(false);
      }, 2500);
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoading(false);
        return;
      }
    }
  }

  async function createTransaction({
    name,
    amount,
    type,
    categoryId,
    date,
  }: {
    name: string;
    amount: number;
    type: string;
    categoryId: string;
    date: Date | undefined;
  }) {
    setLoading(true);
    try {
      let correct_date;
      const token = window.localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      if (date === undefined) {
        correct_date = new Date().toISOString();
      } else {
        correct_date = date.toISOString();
      }

      const server_response: AxiosResponse = await server.post(
        `/v1/${type}/create`,
        {
          amount,
          categoryId: categoryId,
          token,
          name,
          createdAt: correct_date,
        }
      );

      if (server_response.status === 201) {
        getTransactions({
          month: new Date(correct_date).getMonth() + 1,
          year: new Date(correct_date).getFullYear(),
        });
        setLoading(false);
        return toast.success(server_response.data.message);
      }

      setLoading(false);
      return;
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoading(false);
        return toast.error(error.response?.data.message);
      }
    }
  }

  async function deleteTransaction({ id, type }: { id: string; type: string }) {
    setLoading(true);
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const server_response: AxiosResponse = await server.delete(
        `/v1/${type}/delete/${id}`
      );

      if (server_response.status === 200) {
        getTransactions({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });
        setLoading(false);
        return toast.success(server_response.data.message);
      }

      setLoading(false);
      return;
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoading(false);
        return toast.error(error.response?.data.message, );
      }
    }
  }

  return (
    <DataContext.Provider
      value={{
        categories,
        loading,
        transactions,
        getCategories,
        createCategory,
        createTransaction,
        getTransactions,
        deleteTransaction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
