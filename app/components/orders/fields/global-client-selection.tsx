import * as React from "react";
import { Check } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import HighlightText from "@/components/generic/highlight-text";
import { addPhoneMask } from "@/lib/utils/utils";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/styles";
import { ClientReturnType } from "@/routes/api.list/getCompanyClients";
import { useSignals } from "@preact/signals-react/runtime";
import { emptyOrder, order } from "../order";
import { searchClient } from "@/api/clients";
import {showMoneyFlow} from "@/routes/dashboard.orders";
import {moneyFlow} from "@/components/money-flow/money-flow";
import {resetOrderContent} from "@/components/orders/modal/modal.order";

export function GlobalClientSelection() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([] as ClientReturnType[]);
  const [searchText, setSearchText] = React.useState("");
  const [value, setValue] = React.useState(null);

  const handleOnSearchChange = useDebouncedCallback((e: any) => {
    setSearchText(e.target.value);

    searchClient(e.target.value).then((clients) => {
      setItems(clients.slice(0, 10));
    });
  }, 10); // Increase debounce as application grows

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        moneyFlow.value = emptyOrder;
      }

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        resetOrderContent()
      }
    };

    document?.addEventListener("keydown", down);
    return () => document?.removeEventListener("keydown", down);
  }, [showMoneyFlow?.value]);

  useSignals();

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen} filter={() => 1}>
        <CommandInput
          placeholder="Separe por vírgula(,) para ultilizar múltiplos filtros"
          onKeyUpCapture={handleOnSearchChange}
        />

        <CommandList>
          <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
          {items?.map((item) => (
            <CommandItem
              className="flex flex-col items-start mt-0"
              key={item?.id}
              value={item?.id}
              onSelect={(client_id: ClientReturnType) => {
                // if (!order.value)
                order.value = {
                  ...emptyOrder,
                  ...order.value,
                  client_id: client_id,
                } as any;
                setOpen(false);
              }}
            >
              <span className="flex flex-row">
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item?.id ? "block" : "hidden"
                  )}
                />
                <HighlightText
                  searchText={searchText || ""}
                  content={item?.name || ""}
                />
              </span>
              <HighlightText
                searchText={searchText || ""}
                content={item?.additional || ""}
              />
              <HighlightText
                searchText={addPhoneMask(searchText) || ""}
                content={addPhoneMask(item?.phone) || item?.phone || ""}
              />
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
