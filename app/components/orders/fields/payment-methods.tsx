import { Label } from "@/components/ui/label";
import { order } from "../order";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddButtonCircle } from "@/components/generic/buttons/add-button-circle";
import { PaymentMethodSelection } from "./payment-method-selection";
import { Switch } from "@/components/ui/switch";
import TicketPartnerAutocomplete from "@/components/generic/autocomplete/ticket-partner/ticket-partner-autocomplete";
import { Separator } from "@/components/ui/separator";

export function PaymentMethods() {
  const add = () => {
    order.value = {
      ...order.value,
      OrderPayments: [
        ...order.value.OrderPayments,
        { method: "MONEY", price: 0 },
      ],
    };
  };

  return (
    <div className="bg-card p-1 ">
      <div className="flex justify-between items-center">
        <Label htmlFor="name">Método(s) de pagamento</Label>
        <AddButtonCircle onClick={add} />
      </div>

      <span className="text-muted-foreground text-xs hidden sm:block">
        Selecione os métodos de pagamento da venda
      </span>
      <section className="flex flex-col space-y-1.5 pb-3 md:min-h-[200px] md:max-h-[200px] overflow-auto">
        {/* Listagem */}
        {order.value?.OrderPayments?.map((product, index) => (
          
          <span className="flex flex-col" key={index}>
            <span className="flex flex-row pl-1 pt-1 pb-1">
              <span className="flex flex-col mr-2">
                <label htmlFor="paid" className="text-muted-foreground text-xs">
                  Pago
                </label>
                <Switch
                  // className="mt-2"
                  checked={order.value?.OrderPayments[index]?.paid as any}
                  onCheckedChange={(checked) => {
                    order.value = {
                      ...order.value,
                      OrderPayments: order.value.OrderPayments.map((o, i) =>
                        index === i ? { ...o, paid: checked } : o
                      ) as any,
                    };
                  }}
                />
              </span>
              
              <span className="mt-2 w-full mr-1">
                <PaymentMethodSelection
                  value={order.value.OrderPayments[index].method}
                  onChange={(newMethod) => {
                    order.value = {
                      ...order.value,
                      OrderPayments: order.value.OrderPayments.map((e, i) =>
                        index === i ? { ...e, method: newMethod } : e
                      ),
                    };
                  }}
                />
              </span>

              {order.value?.OrderPayments?.length > 1 && (
                <span className="w-full flex mt-2">
                  <Input
                    placeholder="Valor"
                    type="number"
                    onChange={(e) => {
                      order.value = {
                        ...order.value,
                        OrderPayments: order.value.OrderPayments.map((o, i) =>
                          index === i ? { ...o, price: e.target.value } : o
                        ) as any,
                      };
                    }}
                    min={0}
                    className="mx-1 text-xs"
                    value={order.value?.OrderPayments[index]?.price as any}
                  />

                  <Button
                    className="p-0 ml-1 w-5 h-5 mt-2 bg-destructive"
                    onClick={() => {
                      order.value = {
                        ...order.value,
                        OrderPayments: order.value.OrderPayments.filter(
                          (e, i) => index !== i
                        ),
                      };
                    }}
                  >
                    <X className="mx-1  text-primary" />
                  </Button>
                </span>
              )}
            </span>
            
            {order.value?.OrderPayments.at(index).method === "TICKET" && (
            <section className="px-1 flex flex-col">
              <label htmlFor="paid" className="text-muted-foreground text-xs">Empresa do vale</label>
              <TicketPartnerAutocomplete 
                value={order.value?.OrderPayments[index]?.ticket_partner_id as any}
                setSelected={(ticket_partner_selected) => {
                  order.value = {
                    ...order.value,
                    OrderPayments: order.value.OrderPayments.map((o, i) =>
                      index === i ? { ...o, ticket_partner_id: ticket_partner_selected } : o
                    ) as any,
                  };
                }}
              />

              <label htmlFor="paid" className="text-muted-foreground text-xs pt-2">Número do vale</label>
              <Input 
                placeholder="Número do vale"
                value={order.value?.OrderPayments[index]?.ticket_code as any}
                onChange={(e) => { 
                  order.value = {
                    ...order.value,
                    OrderPayments: order.value.OrderPayments.map((o, i) =>
                      index === i ? { ...o, ticket_code: e.target.value } : o
                    ) as any,
                  };
                }}
              />
            </section>
            )}
            <Separator className="mt-2"/>
          </span>
        ))}
      </section>
    </div>
  );
}
