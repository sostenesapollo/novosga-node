import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signal } from "@preact/signals-react";
import { paymentMethodsAvailable } from "@/lib/utils/payment-methods";
import { Deliverymans } from "@prisma/client";

export const deliverymans = signal(null as Deliverymans[] | null);

type PropsType = { onChange: (newValue: string) => void; value: string };

export function PaymentMethodSelection({ onChange, value, ...props }: PropsType) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um valor" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(paymentMethodsAvailable)?.map(([key, value]) => (
            <SelectItem key={key} value={key}>
              <span className="flex flex-row">
                <span className="text-xs truncate">{value}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
