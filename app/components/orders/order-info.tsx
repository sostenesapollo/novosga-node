import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  X,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { localMoney } from "@/lib/utils/currency";
import { addPhoneMask, getPaymentMethod } from "@/lib/utils/utils";
import { serializeAddressNoNeighborhood } from "@/lib/utils/utils";
import { order } from "./order";
import { useSignals } from "@preact/signals-react/runtime";

export default function OrderInfo() {
  useSignals();

  return (
    <>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Venda N. {order?.value?.counter}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              {dayjs().format("D/MM/YYYY [às] HH:mm")}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Rastrear pedido
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Modificar</DropdownMenuItem>
                <DropdownMenuItem>Mover</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Apagar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="icon"
              variant="outline"
              onClick={() => (order.value = null)}
              className="h-8 w-8"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">More</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Detalhes da venda</div>
            <ul className="grid gap-3">
              {order?.value?.OrderProducts?.map((product) => (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground truncate max-w-60">
                    {product?.quantity} x {product.Product?.name}
                  </span>
                  <span>
                    {localMoney(product.unit_price * product.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>
                  {localMoney(
                    order?.value?.OrderPayments?.reduce(
                      (c: any, n: any) => c + n.price,
                      0
                    )
                  )}
                </span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Endereço para envio</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>{order?.value?.Client?.name}</span>
                <span>
                  {serializeAddressNoNeighborhood(order?.value?.Client)}
                </span>
                <span>{order?.value?.Client?.Street?.Neighborhood?.name}</span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Entregador</div>
              <div className="text-muted-foreground">
                {order?.value?.Deliveryman?.name}
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Dados do cliente</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd>{order?.value?.Client?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Telefone/Whatsapp</dt>
                <dd>
                  <a href="tel:">
                    {addPhoneMask(
                      order?.value?.Client?.phone ||
                        order?.value?.Client?.whatsapp ||
                        ""
                    )}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Forma de pagamento</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  {getPaymentMethod(order?.value?.OrderPayments?.at(0)?.method)}
                </dt>
                {/* <dd>**** **** **** 4532</dd> */}
              </div>
            </dl>
          </div>
          {/* <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Código da venda</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  {order?.value?.id}
                </dt>
              </div>
            </dl>
          </div> */}
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </>
  );
}
