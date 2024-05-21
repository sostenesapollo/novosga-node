import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  ListFilter,
  MoreVertical,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "@/components/orders/orders-table";
import OrderInfo from "@/components/orders/order-info";

export function meta() {
  return [{ title: "Clientes - Novo SGA" }];
}

export default function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 ">
        <Tabs defaultValue="1">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="1" className="text-xs">
                <span className="md:hidden">Clientes</span>
                <span className="hidden md:block  text-muted">Clientes</span>
              </TabsTrigger>
              <TabsTrigger value="2" className="text-xs">
                <span className="md:hidden">Clientes inativos</span>
                <span className="hidden md:block">Clientes inativos</span>
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Todas as vendas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Vendas em aberto
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Vendas não entregues
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Vendas não entregues
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="1">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Clientes</CardTitle>
                <CardDescription>
                  Listagem de clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>{/* <OrdersTable /> */}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Clientes inativos</CardTitle>
                <CardDescription>Clientes inativos</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="3">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Vendas em aberto</CardTitle>
                <CardDescription>Vendas em aberto</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* <OrderInfo /> */}
    </main>
  );
}
