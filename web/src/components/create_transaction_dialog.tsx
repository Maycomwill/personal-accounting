import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState, type FormEvent } from "react";
import useData from "@/hooks/useData";
import { FaPlus } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import type { Category } from "@/interfaces";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

function CreateTransactionDialog() {
  const { loading, categories, createTransaction } = useData();
  const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactionType, setTransactionType] = useState<string>("incoming");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  function handleCreate(e: FormEvent) {
    e.preventDefault();
    createTransaction({
      name: transactionName,
      amount: Number(amount),
      type: transactionType,
      categoryId: category,
      date,
    });
    setTransactionName("");
    setCategory("");
    setAmount("");
    setDate(undefined);
    setDialogOpen(false);
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="bg-white/10 p-4 rounded-full focus-within:ring-cyan-500 focus-within:ring-2 transition-colors duration-150 ease-in-out cursor-pointer hover:shadow-md">
        <FaPlus className="size-6" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vamos criar uma transação</DialogTitle>
          <DialogDescription>
            Dê um nome, valor, data e escolha uma categoria
          </DialogDescription>
          <form
            onSubmit={handleCreate}
            className="flex flex-col space-y-4 pt-4"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <Input
                required
                onChange={(e) => setTransactionName(e.target.value)}
                type="text"
                name="category_name"
                id="category_name"
                placeholder="Ex: Alimentação"
              />
              <Select required onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => {
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="w-full">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between 
                      "
                    >
                      {date ? (
                        date.toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">
                          Select date
                        </span>
                      )}
                      <ChevronDownIcon className="text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Input
                required
                type="number"
                name="Valor"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 100"
              />
              <RadioGroup
                onValueChange={(e) => setTransactionType(e)}
                defaultValue="incoming"
                className="flex space-x-8"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="incoming" id="r1" />
                  <Label htmlFor="r1">Entrada</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="expense" id="r2" />
                  <Label htmlFor="r2">Saída</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" disabled={loading}>
              Criar
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;
