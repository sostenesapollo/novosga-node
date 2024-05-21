import { UnpaidOrdersType } from "@/routes/api.list/getDailyMetrics";
import { signal } from "@preact/signals-react";
import dayjs from "dayjs";
import { Circle } from "../generic/circle";
import { INPLACE_COLOR, selectedDate } from "./orders-table";
import { useSignals } from "@preact/signals-react/runtime";
import { sortByCreatedAt } from "@/lib/utils/utils";

export const unpaidOrders = signal<UnpaidOrdersType>([]);

export function UnpaidOrders() {
    return (
        <span className=" overflow-auto ">

            <div className="flex justify-between bg-gray-200 pb-1">
                <h3 className="mt-1 pl-2 pt-1 text-sm font-bold text-black">
                Vendas em aberto
                </h3>
                <div className="mt-1 pl-2 pr-3 pt-1 text-sm font-bold text-black">
                    Quantidade: {getUnpaidOrdersTotal()}
                </div>
            </div>

            {getPreviousDaysUnpaidOrders()?.length > 0 && (<TableListOrdersUnpaid orders={sortByCreatedAt(getPreviousDaysUnpaidOrders())}/> )}
            {getTicketUnpaidOrders()?.length > 0 && (<TableListOrdersUnpaid orders={getTicketUnpaidOrders()} />)}
            {getTodayUnpaidOrders()?.length > 0 && (
              <div className="">
                <h3 className="bg-gray-200 pl-2 pt-3 text-xs font-bold text-gray-600 text-gray-900 xl:text-sm">VENDAS DE HOJE</h3>
                <TableListOrdersUnpaid orders={sortByCreatedAt(getTodayUnpaidOrders())}/>
              </div>
            )}
        </span>
    )
}


const TableListOrdersUnpaid = ({ orders }: { orders: any }) => {
    useSignals()
    return orders?.length === 0 ? (
      <div className="pb-3 pt-2 text-center">Nenhuma a receber.</div>
    ) : (
      <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 sticky top-0">
          <tr key={0}>
            <th
              key="Cliente"
              scope="col"
              className="pb-2 pl-2 pt-2 text-left text-xs uppercase text-gray-500"
            >
              Cliente
            </th>
            <th
              key="Data"
              scope="col"
              className="pb-2 pl-2 pt-2 text-center text-xs uppercase text-gray-500"
            >
              Data
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {orders.map(
            (order: any, id: any) =>
              !order.paid && (
                <tr
                  className="cursor-default cursor-pointer hover:bg-gray-100"
                  key={id}
                  onClick={() => {
                    selectedDate.value = dayjs(order.created_at).toDate()
                  }}
                >
                  <td className="flex cursor-pointer flex-col pl-2 text-xs font-semibold text-gray-900">
                    <div className="flex flex-row text-xs">
                      <Circle
                        size="3"
                        color={order.Deliveryman?.color || INPLACE_COLOR}
                        textColor={order.Deliveryman?.color}
                        className="mr-2"
                      />
                      {order.Client?.name || "Não informado"}
                    </div>

                    <p className="text-xs">
                      {order.OrderPayments[0] &&
                        order.OrderPayments[0]?.TicketPartner?.name && (
                          <span className="text-bold text-blue-500">
                            [
                            {order.OrderPayments[0] &&
                              order.OrderPayments[0]?.TicketPartner?.name}
                            ]
                          </span>
                        )}
                    </p>
                  </td>
                  <td className="cursor-pointer whitespace-nowrap pl-2 text-center text-xs font-bold text-gray-900">
                    {dayjs(new Date(order.created_at)).format("DD/MM/YYYY")}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      </>
    );
  };

const getUnpaidOrdersTotal = () => unpaidOrders.value?.reduce( (acc: any, order: any) => acc + (order.paid ? 0 : 1),0);

const getTicketUnpaidOrders = () => {
  
  const rows = unpaidOrders.value
    ?.filter(
      (e: any) =>
        e.OrderPayments?.length === 1 &&
        e.OrderPayments[0]?.method === "TICKET"
    )
    ?.sort(
      (a: any, b: any) =>
        a.OrderPayments?.at(0)?.TicketPartner?.id -
        b.OrderPayments?.at(0)?.TicketPartner?.id
    ) as any;

  const companyIds = new Map();
  let sorted = [] as any;

  for (const row of rows) {
    const ticketPartner = row.OrderPayments?.at(0)?.TicketPartner?.name;
    if (!companyIds.has(ticketPartner)) {
      companyIds.set(ticketPartner, true);
      const filteredRows = rows.filter(
        (e: any) =>
          ticketPartner === e.OrderPayments?.at(0)?.TicketPartner?.name
      );
      sorted = [...sorted, ...filteredRows];
    }
  }

  return sorted;
};

const getPreviousDaysUnpaidOrders = () =>
  unpaidOrders.value?.filter(
    (e: any) => {
      if(!e?.OrderPayments?.at(0)) return;
      return e?.OrderPayments[0]?.method !== "TICKET" &&
      dayjs(e.created_at).format("DD/MM/YYYY") !==
        dayjs().format("DD/MM/YYYY")
  }).sort((a: any, b: any) => dayjs(b.created_at).diff(dayjs(a.created_at))) as any;

const getTodayUnpaidOrders = () =>
  unpaidOrders.value?.filter(
    (e: any) => {
      if(!e?.OrderPayments?.at(0)) return;
      e?.OrderPayments[0]?.method !== "TICKET" &&
      dayjs(e?.created_at).format("DD/MM/YYYY") ===
        dayjs().format("DD/MM/YYYY")
  }) as any;
