import useData from "@/hooks/useData";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import type { Expense, Incoming } from "@/interfaces";
import Loading from "./loading";
import DeleteTransactionDialog from "./delete_transaction_dialog";
import { HandleCategoryIcon } from "@/assets/CategoryIcons";
import { PiggyBank } from "lucide-react";

function Dashboard() {
  const { getTransactions, loading, transactions, categories } = useData();
  const [period, setPeriod] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    getTransactions(period);
    if (transactions) {
      setPeriod({
        month: transactions.period.month,
        year: transactions.period.year,
      });
    }
  }, [period]);

  function sumValues(transactions: Incoming[] | Expense[]) {
    let sum = 0;
    transactions.forEach((transaction) => {
      sum += transaction.amount;
    });
    return sum;
  }

  function yieldValues(totalIncomings: number, totalExpenses: number) {
    return (totalIncomings - totalExpenses).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  function handleCategory(categoryId: string) {
    const categoryName = categories.find((cat) => cat.id === categoryId)?.name;
    if (!categoryName) {
      return <PiggyBank />;
    }
    return HandleCategoryIcon(categoryName);
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="w-full flex items-center justify-center text-2xl uppercase font-display">
        Dashboard
      </h1>
      <div className="w-full">
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full flex flex-col my-4">
            <Table>
              <TableCaption>
                Movimentações no período de:{" "}
                {transactions
                  ? `${transactions.period.month}/${transactions.period.year}`
                  : `0${period.month}/${period.year}`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[120px]">Nome</TableHead>
                  <TableHead className="max-w-[60px]">Valor</TableHead>
                  <TableHead className="max-w-[20px]">Tipo</TableHead>
                  <TableHead className="max-w-[40px]">Data</TableHead>
                  <TableHead className="max-w-[50px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions &&
                  transactions.incomings.map((incoming: Incoming) => {
                    return (
                      <TableRow
                        className="bg-green-500/10 hover:bg-green-500/20"
                        key={incoming.id}
                      >
                        <TableCell>{incoming.name}</TableCell>
                        <TableCell>
                          {incoming.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          {handleCategory(incoming.categoryId)}
                        </TableCell>
                        <TableCell>
                          {format(incoming.createdAt, "dd/MM")}
                        </TableCell>
                        <TableCell className="flex space-x-2 items-center justify-start">
                          <DeleteTransactionDialog
                            id={incoming.id}
                            type={"incoming"}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {transactions &&
                  transactions.expenses.map((expense: Expense) => {
                    return (
                      <TableRow
                        className="bg-red-500/10 hover:bg-red-500/20"
                        key={expense.id}
                      >
                        <TableCell>{expense.name}</TableCell>
                        <TableCell>
                          {(-Math.abs(expense.amount)).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          {handleCategory(expense.categoryId)}
                        </TableCell>
                        <TableCell>
                          {format(expense.createdAt, "dd/MM")}
                        </TableCell>
                        <TableCell className="flex space-x-2 items-center justify-start">
                          <DeleteTransactionDialog
                            id={expense.id}
                            type={"expense"}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {transactions?.incomings.length === 0 && (
                  <TableRow>
                    <TableCell>Nenhuma transação nesse período</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entradas</TableHead>
                    <TableHead>Saídas</TableHead>
                    <TableHead>Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions && (
                    <TableRow>
                      <TableCell className="bg-green-500/10">
                        {sumValues(transactions!.incomings).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 2,
                          }
                        )}
                      </TableCell>
                      <TableCell className="bg-red-500/10">
                        -
                        {sumValues(transactions!.expenses).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 2,
                          }
                        )}
                      </TableCell>
                      <TableCell className="bg-cyan-500/10 font-bold">
                        {yieldValues(
                          sumValues(transactions!.incomings),
                          sumValues(transactions!.expenses)
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
