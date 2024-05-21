import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignals } from "@preact/signals-react/runtime";
import { productCategories, productCategoriesFiltered } from "./category-selection";
import { moneyFlow } from "../money-flow";

export function IsEntranceSelection() {
  useSignals();

  return (
    <section className="flex flex-col flex-grow space-y-1.5 pt-1  ">
      <Label htmlFor="name">Tipo (Entrada/Saída)</Label>
      <Select
        onValueChange={(value) => {
          console.log(value);

          productCategoriesFiltered.value = productCategories.value?.filter(e=>e.is_entrance === value) as any;
          moneyFlow.value = {...moneyFlow.peek(), money_flow_category_id: productCategoriesFiltered.value[0].id, is_entrance: value}
        }}
        value={moneyFlow.value?.is_entrance as any}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={'false'} value={false} className="truncate">
              Saída
            </SelectItem>
            <SelectItem key={'true'} value={true} className="truncate">
              Entrada
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
}
