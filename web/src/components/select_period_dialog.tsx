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
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

function SelectPeriodDialog() {
  const { getTransactions, loading } = useData();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  function handleCreate(e: FormEvent) {
    e.preventDefault();
    getTransactions({ month: date!.getMonth() + 1, year: date!.getFullYear() });
    setModalOpen(false);
    return;
  }
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="w-1/2" size={"lg"} variant={"link"}>
          Alterar período
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione um mês e ano</DialogTitle>
          <DialogDescription>
            Basta escolher um mês e ano como: Janeiro de 2025
          </DialogDescription>
          <form
            onSubmit={handleCreate}
            className="flex flex-col items-center justify-center space-y-4 pt-4"
          >
            <div className="flex flex-col gap-3">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
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
                      return;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" disabled={loading}>
              Alterar
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SelectPeriodDialog;
