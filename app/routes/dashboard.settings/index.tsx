import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loaderDashboardSettings } from "./dashboard.settings.loader";

export const loader = loaderDashboardSettings;

export function meta() {
  return [{ title: "Configurações - Novo SGA" }];
}

export default function Settings() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue="1">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="1" className="text-xs">
                <span className="md:hidden">Configurações da empresa</span>
                <span className="hidden md:block">
                  Configurações da empresa
                </span>
              </TabsTrigger>
              <TabsTrigger value="2" className="text-xs">
                <span className="md:hidden">Whatsapp</span>
                <span className="hidden md:block">Whatsapp</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {/* 1 */}
          <TabsContent value="1">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Configurações da sua empresa</CardDescription>
              </CardHeader>
              <CardContent>{/* <OrdersTable /> */}</CardContent>
            </Card>
          </TabsContent>
          {/* 2 */}
          <TabsContent value="2">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Configurações do Whatsapp</CardTitle>
                <CardDescription>
                  Conexão, desconexão, informações ...
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>{/*  */}</div>
    </main>
  );
}
