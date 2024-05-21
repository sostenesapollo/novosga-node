import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deliverymanType } from "@/routes/api.list/getDeliverymans";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import axios from "axios";
import { order } from "../order";
import { signal } from "@preact/signals-react";
import { Circle } from "@/components/generic/circle";
import { searchDeliverymans } from "@/api/deliverymans";

export const deliverymans = signal(null as deliverymanType[] | null);

export function DeliverymanSelection() {
  useSignals();

  useSignalEffect(() => {
    searchDeliverymans().then((rows) => {
      deliverymans.value = rows as any;
    });
  });

  return (
    <section className="flex flex-col flex-grow space-y-1.5">
      <Label htmlFor="name">Entregador</Label>
      <Select
        onValueChange={(id) => {
          order.value = {
            ...order.value,
            deliveryman_id: id,
          };
        }}
        value={order.value?.deliveryman_id as any}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um entregador" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {deliverymans.value?.map((deliveryman, index) => (
              <SelectItem key={index} value={deliveryman.id}>
                <span className="flex flex-row">
                  <Circle color={deliveryman?.color} />
                  <span className="pl-2">{deliveryman.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
}
