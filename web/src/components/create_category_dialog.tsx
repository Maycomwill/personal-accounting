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

function CreateCategoryDialog() {
  const { createCategory, loading } = useData();
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  function handleCreate(e: FormEvent) {
    e.preventDefault();
    createCategory(categoryName);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"} size={"lg"}>
          Criar categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vamos criar uma categoria</DialogTitle>
          <DialogDescription>Dê um nome a nova categoria</DialogDescription>
          <form
            onSubmit={handleCreate}
            className="flex flex-col space-y-4 pt-4"
          >
            <div className="flex flex-col items-center justify-center">
              <input
                onChange={(e) => setCategoryName(e.target.value)}
                className="bg-white/5 w-full outline-none rounded-sm h-10 px-2 ring-2 ring-transparent focus-within:ring-cyan-500 text-white placeholder:text-white/20 "
                type="text"
                name="category_name"
                id="category_name"
                placeholder="Ex: Alimentação"
              />
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

export default CreateCategoryDialog;
