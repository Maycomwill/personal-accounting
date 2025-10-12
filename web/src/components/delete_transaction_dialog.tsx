import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import useData from "@/hooks/useData";
import { Trash2Icon } from "lucide-react";

function DeleteTransactionDialog({
  id,
  type,
}: {
  id: string;
  type: "incoming" | "expense";
}) {
  const { deleteTransaction } = useData();
  const [open, setOpen] = useState(false);
  function handleDelete() {
    deleteTransaction({ id, type });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Trash2Icon className="hover:text-red-500" size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="uppercase text-destructive">
            Deletar
          </DialogTitle>
          <DialogDescription>
            Deseja deletar essa {type === "expense" ? "despesa" : "receita"}?
          </DialogDescription>
          <div className="w-full flex items-center justify-between px-8 pt-4">
            <Button
              className="w-[40%]"
              variant={"destructive"}
              onClick={handleDelete}
            >
              Sim
            </Button>
            <Button className="w-[40%]" onClick={() => setOpen(false)}>
              Não
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTransactionDialog;
