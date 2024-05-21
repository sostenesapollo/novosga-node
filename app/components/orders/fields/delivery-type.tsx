import { Label } from "@/components/ui/label";
import { order } from "../order";
import { Checkbox } from "@/components/ui/checkbox";

export function DeliveryType() {
  return (
    <>
      <Label htmlFor="name" className="">
        Selecione a forma de entrega
      </Label>
      <section className="flex items-center space-x-2">
        <Checkbox
          checked={order.value?.is_delivery}
          className="text-white w-6 h-6"
          onCheckedChange={(checked) =>
            (order.value = { ...order.value, is_delivery: true })
          }
        />
        <label className="text-sm font-medium leading-none  peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Entrega
        </label>
        <Checkbox
          checked={!order.value?.is_delivery}
          className=" w-6 h-6"
          onCheckedChange={(checked) =>
            (order.value = { ...order.value, is_delivery: false })
          }
        />
        <label className="text-sm font-medium  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Portaria
        </label>
      </section>
    </>
  );
}
