import { Label } from "@/components/ui/label";
import { order } from "../order";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProductAutocomplete from "@/components/generic/autocomplete/product/product-autocomplete";
import { Input } from "@/components/ui/input";
import { AddButtonCircle } from "@/components/generic/buttons/add-button-circle";
import { Card } from "@/components/ui/card";

export function ProductsSelection() {
  const addProduct = () => {
    order.value = {
      ...order.value,
      OrderProducts: [
        ...order.value.OrderProducts,
        { quantity: 1, unit_price: 0, Product: null } as any,
      ],
    } as any;
  };

  return (
    // <div className="bg-gray-200 p-1">
    <Card className="overflow-hidden p-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="name">Produtos</Label>
        <AddButtonCircle onClick={addProduct} />
      </div>
      <span className="text-muted-foreground text-xs hidden sm:block">
        Selecione os produtos da venda
      </span>
      <section className="flex flex-col justify-start space-y-1.5 pt-1 md:min-h-[300px] md:max-h-[300px] overflow-auto">
        {/* Listagem */}
        {order.value?.OrderProducts?.map((product, index) => (
          <span className="flex flex-row" key={index}>
            <ProductAutocomplete
              value={order.value?.OrderProducts[index]?.Product?.id as any}
              firstLoad={(product) => {
                if (order.value?.id || order.value?.OrderProducts?.length > 1) {
                  return;
                }

                order.value = {
                  ...order.value,
                  OrderProducts: [
                    {
                      Product: { id: product?.id, name: product?.name },
                      unit_price: product?.price,
                      quantity: 1,
                    }
                  ],
                } as any;
              }}
              setSelected={(v, a) => {
                order.value = {
                  ...order.value,
                  OrderProducts: order.value?.OrderProducts?.map((e, i) =>
                    index === i
                      ? {
                          ...e,
                          Product: {
                            id: v,
                            name: a.name
                          },
                          unit_price: a?.price || 0,
                        }
                      : e
                  ),
                } as any;
              }}
            />
            {/* Quantidade */}
            <Input
              placeholder="Qnt."
              type="number"
              min={0}
              className="w-1/5 mx-1"
              value={order.value?.OrderProducts[index]?.quantity as any}
              onChange={(e) => {
                order.value = {
                  ...order.value,
                  OrderProducts: order.value.OrderProducts.map((o, i) =>
                    index === i ? { ...o, quantity: e.target.value } : o
                  ) ,
                } as any;
              }}
            />
            {/* Valor */}
            <Input
              placeholder="Valor"
              type="number"
              onChange={(e) => {
                order.value = {
                  ...order.value,
                  OrderProducts: order.value.OrderProducts.map((o, i) =>
                    index === i ? { ...o, unit_price: e.target.value } : o
                  ) as any,
                };
              }}
              min={0}
              className="w-1/5"
              value={order.value?.OrderProducts[index]?.unit_price as any}
            />
            {order.value.OrderProducts.length > 1 && (
              <Button
                className="p-0 ml-1 w-5 h-5 mt-2 bg-destructive"
                onClick={() => {
                  order.value = {
                    ...order.value,
                    OrderProducts: order.value.OrderProducts.filter(
                      (e, i) => index !== i
                    ),
                  };
                }}
              >
                <X className="mx-1  text-primary" />
              </Button>
            )}
          </span>
        ))}
      </section>
    </Card>
  );
}
