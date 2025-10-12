import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {} from "@radix-ui/react-tooltip";
import {
  CircleDollarSign,
  CreditCard,
  PartyPopper,
  PiggyBank,
  ReceiptIcon,
  ShoppingBag,
  Utensils,
} from "lucide-react";

export function HandleCategoryIcon(categoryName: string) {
  switch (categoryName) {
    case "Alimentação":
      return (
        <Tooltip>
          <TooltipTrigger>
            <Utensils />
          </TooltipTrigger>
          <TooltipContent>
            <p>Alimentação</p>
          </TooltipContent>
        </Tooltip>
      );
    case "Contas":
      return (
        <Tooltip>
          <TooltipTrigger>
            <ReceiptIcon />
          </TooltipTrigger>
          <TooltipContent>
            <p>Contas</p>
          </TooltipContent>
        </Tooltip>
      );
    case "Lazer":
      return (
        <Tooltip>
          <TooltipTrigger>
            <PartyPopper />
          </TooltipTrigger>
          <TooltipContent>
            <p>Lazer</p>
          </TooltipContent>
        </Tooltip>
      );
    case "Salário":
      return (
        <Tooltip>
          <TooltipTrigger>
            <CircleDollarSign />
          </TooltipTrigger>
          <TooltipContent>
            <p>Salário</p>
          </TooltipContent>
        </Tooltip>
      );
    case "Compras":
      return (
        <Tooltip>
          <TooltipTrigger>
            <ShoppingBag />
          </TooltipTrigger>
          <TooltipContent>
            <p>Compras</p>
          </TooltipContent>
        </Tooltip>
      );
    case "Cartão":
      return (
        <Tooltip>
          <TooltipTrigger>
            <CreditCard />
          </TooltipTrigger>
          <TooltipContent>
            <p>Cartão</p>
          </TooltipContent>
        </Tooltip>
      );
    case "Outros":
      return (
        <Tooltip>
          <TooltipTrigger>
            <PiggyBank />
          </TooltipTrigger>
          <TooltipContent>
            <p>Outros</p>
          </TooltipContent>
        </Tooltip>
      );
    default:
      return (
        <Tooltip>
          <TooltipTrigger>
            <PiggyBank />
          </TooltipTrigger>
          <TooltipContent>
            <p>Outros</p>
          </TooltipContent>
        </Tooltip>
      );
  }
}
