import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { Circle } from "@/components/generic/circle";
import { searchProductsCategories } from "@/api/products";
import { getMoneyFlowCategoriesType } from "@/routes/api.list/getMoneyFlowCategories";
import { moneyFlow } from "../money-flow";

export const productCategories = signal([] as getMoneyFlowCategoriesType);
export const productCategoriesFiltered = signal([] as getMoneyFlowCategoriesType);

export function CategorySelection() {
  useSignals();

  useSignalEffect(() => {
    searchProductsCategories().then((rows) => {
      console.log(rows);
      
      productCategories.value = rows as any;
      productCategoriesFiltered.value = productCategories.value.filter(e=>e.is_entrance === false) as any;
      
      if(moneyFlow.peek() !== null) {
        moneyFlow.value = {
          ...moneyFlow.peek(),
          money_flow_category_id: productCategoriesFiltered.value[0].id,
          is_entrance: false,
        }
      }
    });
  });

  return (
    <section className="flex flex-col flex-grow space-y-1.5">
      <Label htmlFor="name">Categoria</Label>
      <Select
        onValueChange={(id) => {
          moneyFlow.value = {
            ...moneyFlow.value,
            money_flow_category_id: id,
          };
        }}
        value={moneyFlow.value?.money_flow_category_id as any}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {productCategoriesFiltered.value?.map((category, index) => (
              <SelectItem key={index} value={category.id} className="truncate">
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
}
