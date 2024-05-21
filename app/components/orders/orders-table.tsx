import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localMoney } from "@/lib/utils/currency";
import dayjs from "dayjs";
import { Icons } from "@/components/icons/icons";
import { TicketPartner } from "@prisma/client";
import { paymentMethodsAvailable } from "@/lib/utils/payment-methods";
import { getNextOrderStatus, serializeAddress } from "@/lib/utils/utils";
import { CookieParams } from "@/session.server";
import Tooltip from "@/components/tooltip/tooltip";
import { twJoin } from "tailwind-merge";
import { Checkbox } from "../ui/checkbox";
import { OrderType } from "@/routes/api.list/getOrders";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { socket } from "@/routes/dashboard";
import { filterOrdersBy, ordersFiltered } from "@/routes/dashboard.orders";
import { useLoaderData } from "@remix-run/react";
import { loaderDashboardOrders } from "@/routes/dashboard.orders/dashboard.orders.loader";
import { DeleteButton } from "../generic/buttons/delete-button";
import { order } from "./order";
import { updateOrdersPaid, updateOrdersStatus } from "@/api/order";
import { notify } from "../generic/snackbar";
import { sendMessageToDeliverymanInWhatsapp, sendMessageToDeliverymanInWhatsappPaidOrder } from "@/api/whatsapp";
import {KeybindingsHelper} from "@/components/keybindings-helper/keybindings-helper";

type getOrderInfoType = {
  order: OrderType & { Client: { additional: any } };
  field: string;
  ticketPartners?: TicketPartner[];
  user?: CookieParams;
};

export const selectedAll = signal(false);
export const selectedOrders = signal([] as string[]);
//
export const user = signal({} as CookieParams);
export const orders = signal(null as OrderType[] | null);
export const ticketPartners = signal([] as any);
export const deliverymans = signal([] as any);
export const metrics = signal([] as any);
export const unpaidOrders = signal([] as any);
export const whatsappApiUrl = signal("" as any);
export const selectedDate = signal(new Date() as Date | null);

export const INPLACE_COLOR = "#fafacf";

export default function OrdersTable() {
  useSignals();

  const onClickRow = (clickedOrderData: OrderType) => {
    console.log("Row clicked", clickedOrderData);
    // if (order.value?.id === order?.id) return (order.value = null);
    order.value = clickedOrderData;
    // console.log(order);
  };

  const handleCheckboxSelectOneChange = (id: string) => {
    selectedOrders.value = selectedOrders.value.includes(id)
      ? selectedOrders.value.filter((checkboxId: string) => checkboxId !== id)
      : [...selectedOrders.value, id];
    if(selectedOrders.value?.length === ordersFiltered.value?.length) {
      selectedAll.value = true;
    } else {
      selectedAll.value = false;
    }
  };

  const handleCheckboxSelectAllChange = () => {
    selectedOrders.value = selectedAll.value
      ? []
      : orders.value?.map((order: any) => order.id) || [];
    selectedAll.value = !selectedAll.value;
  };

  useSignalEffect(() => {
    const filter = localStorage.getItem("filterOrdersBy");
    if (filter) {
      filterOrdersBy.value = filter as any;
    }
    user.value = data.user
  });

  const data = useLoaderData<typeof loaderDashboardOrders>();

  return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">
                <Checkbox checked={selectedAll.value} id="terms" onClick={handleCheckboxSelectAllChange}/>
              </TableHead>
              <TableHead className="">Cliente</TableHead>
              <TableHead className="hidden xl:table-cell">Endereço</TableHead>
              <TableHead className="hidden xl:table-cell">Pagamento</TableHead>
              <TableHead className="hidden xl:table-cell">Valor</TableHead>
              <TableHead className="hidden xl:table-cell">Ítens</TableHead>
              <TableHead className="hidden xl:table-cell">Hora</TableHead>
              <TableHead className="xl:table-cel text-right xl:text-center text-xs">
                Pago / Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=" text-black">
            {(ordersFiltered.value === null ? data.orders : ordersFiltered.value)?.map((order: any, i) => (
                <TableRow
                    key={i}
                    className={twJoin(
                        i % 2 === 0 && "bg-accent",
                        "cursor-pointer hover:bg-green-400/10 ",
                        order.value?.id === order?.id && "bg-green-500/30"
                    )}
                    style={{
                      backgroundColor: order?.Deliveryman?.color || INPLACE_COLOR,
                      color:
                          order?.Deliveryman?.secondary_color || "black",
                    }}
                >
                  <TableCell
                      className={twJoin(
                          "l-2 text-sm truncate overflow-auto content-center"
                          // order?.id === order?.id && "ml-4"
                      )}
                  >
                    <Checkbox
                        checked={
                          !!selectedOrders.value.find(
                              (selectedId) => selectedId === order.id
                          )
                        }
                        onClick={() => handleCheckboxSelectOneChange(order.id)}
                    />
                  </TableCell>
                  <TableCell
                      className={twJoin(
                          "l-2 text-sm overflow-hidden max-w-40 flex-col"
                          // order?.id === order?.id && "ml-4"
                      )}
                      onClick={() => onClickRow(order)}
                  >
                    <div>
                      {getOrderInfo({order, field: "client"})}
                    </div>
                    <span className="xl:hidden truncate w-10">
                  {getOrderInfo({
                    order,
                    field: "address",
                    user: data.user,
                  })}
                </span>
                    <span className="xl:hidden">
                  {getOrderInfo({order, field: "product"})}
                </span>
                  </TableCell>
                  <TableCell
                      className="hidden xl:table-cell"
                      onClick={() => onClickRow(order)}
                  >
                    {getOrderInfo({order, field: "address", user: data.user})}
                  </TableCell>
                  <TableCell
                      className="hidden xl:table-cell"
                      onClick={() => onClickRow(order)}
                  >
                    {getOrderInfo({order, field: "payment", user: data.user})}
                  </TableCell>
                  <TableCell
                      className="hidden xl:table-cell"
                      onClick={() => onClickRow(order)}
                  >
                    {getOrderInfo({order, field: "value"})}
                  </TableCell>
                  <TableCell
                      className="hidden xl:table-cell"
                      onClick={() => onClickRow(order)}
                  >
                    {getOrderInfo({order, field: "product"})}
                  </TableCell>
                  <TableCell
                      className="hidden xl:table-cell"
                      onClick={() => onClickRow(order)}
                  >
                    {getOrderInfo({order, field: "time", user: data.user})}
                  </TableCell>
                  <TableCell className="text-right xl:text-center space-x-2 xl:flex xl:flex-row">
                    {getOrderInfo({order, field: "paid"})}
                    <span className="">
                  {getOrderInfo({order, field: "status", user: data.user})}
                </span>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <span className="text-center">
        <p className="pt-5"></p>
        <KeybindingsHelper/>
      </span>
      </>
  );
}

const updatePaid = (order_id: string) => {
  console.log("update paid", order_id);

  updateOrdersPaid([order_id]).catch(e=>{
    notify.error('Erro ao atualizar status do pedido.')
  }).finally(async ()=>{
    const order = orders.value?.find(e=>e.id===order_id)
    
    if(order) {
      await sendMessageToDeliverymanInWhatsappPaidOrder(order, user.value.base_name, user.value.whatsappApiUrl)
    }
  })


  // socket.value?.emit("order:updatePaid", order_id);
};

const updateStatus = async (order_id: string, user: CookieParams) => {

  const order = orders.value?.find((e) => e.id === order_id);
  
  updateOrdersStatus([order_id], getNextOrderStatus(order?.status) as any).catch(e=>{
    notify.error('Erro ao atualizar status do pedido.')
  })
  
  if(order?.status === 'NONE') {
    // Send via whatsapp
    try {
      notify.warn(`Enviando mensagem no whatsapp do ${order?.Deliveryman?.name || " entregador"}.`);
      await sendMessageToDeliverymanInWhatsapp( order, user.base_name, user.whatsappApiUrl)
    }catch(e) {
      console.log(e.message);
      notify.error(e.message);
    }
  }

};

const getOrderInfo = ({
  order,
  field,
  user
}: getOrderInfoType) => {
  if (field === "time") return dayjs(order?.created_at).format("HH:mm");
  if (field === "paid")
    return order?.paid ? (
      <Tooltip content={"Venda paga"}>
        <button
          onClick={() => updatePaid(order.id)}
          className="rounded-md border-2 border-green-800 bg-green-600 text-white shadow transition duration-100 ease-in hover:bg-green-700 xl:h-7 xl:w-8"
        >
          <span className="flex">
            <Icons.CheckIcon className="text-white-800 ml-1 mr-1 h-5 w-6" />
            <span className="block pl-1 pr-2 xl:hidden ">Pago</span>
          </span>
        </button>
      </Tooltip>
    ) : (
      <Tooltip content={"Venda em aberto"}>
        <button
          onClick={() => updatePaid(order.id)}
          className="xl:h-7 xl:w-8 rounded-md border-2 border-red-700 bg-red-700 shadow transition duration-100 ease-in focus:outline-none active:shadow-lg"
        >
          <span className="flex">
            <Icons.TimesIconO className="ml-1 h-5 w-5 text-white" />
            <span className="block pl-1 pr-2 xl:hidden text-white">Aberto</span>
          </span>
        </button>
      </Tooltip>
    );
  if (field === "status")
    return order.status === "NONE" ? (
      <Tooltip
        content={
          <>
            Ainda não enviado<p>Toque para mover para "A caminho"</p>
          </>
        }
      >
        <button
          onClick={(e: any) => updateStatus(order.id, user)}
          className="mouse h-7 w-8 rounded-md border-2 border-gray-200 bg-gray-200 shadow transition duration-100 ease-in focus:outline-none active:shadow-lg"
        >
          <Icons.TimesIconO className="ml-1 h-5 w-5 text-gray-400" />
        </button>
      </Tooltip>
    ) : order.status === "TRANSIT" ? (
      <Tooltip
        content={
          <>
            Pedido à caminho<p>Toque para mover para "Entregue"</p>
          </>
        }
      >
        <button
          onClick={(e: any) => updateStatus(order.id, user)}
          className="mouse h-7 w-8 rounded-md border-2 border-yellow-200 bg-yellow-300 shadow transition duration-100 ease-in focus:outline-none active:shadow-lg"
        >
          <Icons.MotorcycleIcon className="animate-bounce z-0 ml-1 h-5 w-5 pl-1 text-yellow-700" />
        </button>
      </Tooltip>
    ) : (
      <Tooltip content={"Pedido entregue"}>
        <button
          onClick={(e: any) => updateStatus(order.id, user)}
          className="mouse h-7 w-8 rounded-md border-2 border-blue-700 bg-blue-400 shadow transition duration-100 ease-in focus:outline-none active:shadow-lg"
        >
          <Icons.CheckIcon className="ml-1 h-5 w-5 text-white" />
        </button>
      </Tooltip>
    );
  if (field === "delete")
    return (
      <DeleteButton
        className=""
        onClick={() => {
          // ctx?.playNotification("pop");
          // ctx.removeInfo?.setRemoveInfo({
          //   ...ctx.removeInfo,
          //   id: order.id,
          //   action: actionToRemoveOrder,
          // });
        }}
      />
    );
  if (field === "print")
    return (
      // <DeleteButton className=""
      //   onClick={()=>{
      //     ctx.removeInfo?.setRemoveInfo({...ctx.removeInfo, id: order.id, action: actionToRemoveOrder})
      //   }}
      // />
      <a href={`/orcamento?id=${order.id}`}>
        <button
          className={`h-6 w-6 rounded-full bg-blue-400 text-white hover:bg-blue-800`}
        >
          <Icons.PrinterIcon className={`text-white-400 p-1`} />
        </button>
      </a>
    );
  if (field === "product")
    return order?.OrderProducts?.length === 1 ? (
      order?.OrderProducts[0].Product?.name ===
      "RECARGA DE ÁGUA MINERAL 20L" ? (
        <b className="text-indigo-400">
          {order?.OrderProducts[0]?.quantity} x ÁGUA 20L
        </b>
      ) : order?.OrderProducts[0].Product?.name === "RECARGA DE GÁS 13 KG" ? (
        <b className="text-pink-700">
          {order?.OrderProducts[0]?.quantity} x GÁS 13 KG
        </b>
      ) : (
        <a>
          {`${order?.OrderProducts[0]?.quantity} x ${order?.OrderProducts[0].Product?.name}`}
        </a>
      )
    ) : (
      `Venda com ${order?.OrderProducts?.length} ítens`
    );
  if (field === "value")
    return localMoney(
      order.OrderPayments?.reduce((c: any, n: any) => c + n.price, 0)
    );
  if (field === "payment")
    return order.OrderPayments?.length > 1 ? 
      `${order.OrderPayments?.length} formas de pagamento`
        // (order.OrderPayments).map((payment) => (<>{payment.method}</>))
     : order.OrderPayments?.at(0)?.method === "MONEY" ? (
      "À vista"
    ) : order.OrderPayments?.at(0)?.method === "TRANSFER" ? (
      <span className="flex space-x-2">
        <Icons.PixIcon/>
        <span>PIX</span>
      </span>
    ) : order.OrderPayments?.at(0)?.method === "CARD" ? (
      "Cartão"
    ) : order.OrderPayments?.at(0)?.method === "PIX" ? (
      "PIX"
    ) : order.OrderPayments?.at(0)?.method === "BOLETO" ? (
      "BOLETO"
    ) : order.OrderPayments?.at(0)?.method === "TO_RECEIVE" ? (
      "À PRAZO"
    ) : order.OrderPayments?.at(0)?.method === "TICKET" ? (
      <span className="flex">
        <Icons.TicketIcon className="pt-1" />
        <TicketPrice order={order} paymentMethod={order.OrderPayments?.at(0)} />
      </span>
    ) : (
      "Não definido."
    );
  if (field === "address")
    return (
      <>
        {order?.Client?.additional
          ? order?.Client?.additional
          : serializeAddress(order?.Client)}
        <p></p>
        {/* {JSON.stringify(user)} */}
        <p></p>
        {/* <pre>{JSON.stringify(order.Client?.Street?.city_id, null, 2)}</pre> */}
        <p></p>
        {/* TODO: Add city name for Novo Sga Node */}
        {/* {order.Client?.Street?.City?.name ? (
          <p>
            {user?.city_id !== order.Client?.Street?.city_id ? (
              <b>
                {formatCityName(order.Client?.Street?.City?.name)}-{" "}
                {order.Client?.Street?.City?.state}
              </b>
            ) : (
              ""
            )}
          </p>
        ) : (
          ""
        )} */}
      </>
    );

  if (field === "client")
    return order?.Client?.name || "Cliente não informado.";
  if (field === "whatsapp")
    return (
      <button
        // onClick={(e: any) => updateStatus(order.id)}
        className="mouse h-7 w-8 rounded-md border-2 border-blue-700 bg-blue-400 shadow transition duration-100 ease-in focus:outline-none active:shadow-lg"
      >
        <Icons.WhatsappIcon className="ml-1 h-5 w-5 text-white" />
      </button>
    );
};

const TicketPrice = ({ paymentMethod }: any) => {
  return (
    <p>
      {paymentMethod?.method === "TICKET" && (
        <span className="bg-yellow-300 text-black">Vale</span>
      )}

      <span className="bg-yellow-300 text-black">
        {paymentMethod?.ticket_code && `[${paymentMethod?.ticket_code}]`}
      </span>

      <br />

      {paymentMethod?.method === "TICKET" &&
        (paymentMethod?.TicketPartner?.name ? (
          <span className="bg-yellow-300 text-black">
            {paymentMethod?.TicketPartner?.name}
          </span>
        ) : (
          <span className="bg-red-500 text-white">Sem empresa</span>
        ))}
    </p>
  );
};

const getTicketPartnerName = (id: any, ticketPartners?: TicketPartner[]) => {
  const result = ticketPartners?.find((e: any) => e["id"] === id) as any;
  return result ? result["name"] : "";
};
