import { DailyMoneyFlowType } from "@/routes/api.list/getDailyMetrics";
import { signal, useSignalEffect } from "@preact/signals-react";
import { orders, selectedDate } from "./orders-table";
import { NoResults } from "../generic/no-results";
import { sortByCreatedAt } from "@/lib/utils/utils";
import { DeleteButton } from "../generic/buttons/delete-button";
import dayjs from "dayjs";
import { localMoney } from "@/lib/utils/currency";
import ModalMoneyFlow from "../money-flow/modal/money-flow-modal";
import { Button } from "../ui/button";
import { order, showMoneyFlow } from "@/routes/dashboard.orders";
import { X } from "lucide-react";
import { useRef } from "react";
import { modalConfirmRemove, ModalConfirmRemoveGeneric } from "../generic/modal/modal.confirm-remove";
import { deleteMoneyFlow } from "@/api/money-flow";
import { notify } from "../generic/snackbar";
import { getOrder } from "@/api/order";
import { useSignals } from "@preact/signals-react/runtime";
import { OrderType } from "@/routes/api.list/getOrders";

export const moneyFlowList = signal<DailyMoneyFlowType>([]);
export const scrollMoneyFlowRef = signal(null)

export function MoneyFlow() {
    return (
        <span className="oveflow-auto">
            <div className="bg-card pb-1 py-2 shadow flex items-baseline justify-between px-1 lg:px-2">
                <div className="ml-1 mt-0 flex flex-shrink-0 items-center justify-start justify-between">
                    <ModalMoneyFlow />
                </div>
                <div className="ml-6 mt-0 flex flex-shrink-0 items-center justify-end justify-between">
                    <span className=" inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-cyan-800">
                        {(getTotals().moneyFlow + getTotals().ordersPaid || 0).toLocaleString("pt-br", {style: "currency",currency: "BRL" })}{" "}em caixa
                    </span>
                    {/* Vendas */}
                    <span className=" inline-flex text-xs  items-center rounded-full bg-pink-100 px-3 py-0.5 font-bold text-pink-900">
                        {orders.value?.length || 0} Vendas
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 h-7 gap-1 md:hidden"
                        onClick={()=>showMoneyFlow.value = false}
                    >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                </div>

                {/* List */}
            </div>
            <ListMoneyFlow/>
        </span>
    )
}

function ListMoneyFlow() {
    
    const listRef = useRef(null);
    useSignalEffect(()=>{
        setTimeout(() => {
            try { listRef?.current?.lastElementChild?.scrollIntoView({block: 'end',  behavior: 'smooth' }); }catch(e){}
        }, 100);
    })
    useSignals()
    return (
        <div className="h-full bg-gray-50 overflow-auto" >
            <ModalConfirmRemoveGeneric />
            {/* {JSON.stringify(moneyFlowList?.value)} */}
            {moneyFlowList?.value?.length === 0 ? (
            <NoResults noResultsText="Sem atualizações de caixa no dia"/>
            ) : (
            <ul
                ref={listRef}
                role="list"
                className="divide-y divide-gray-200 border-b border-gray-200"
            >
                {sortByCreatedAt(moneyFlowList?.value)?.map((flow: any) => (
                <li
                    key={flow.id}
                    className="relative bg-white px-3 py-1 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
                    onClick={(e)=>{
                        if(!flow.order_payment_id) return;
                        getOrder({order_payment_id: flow.order_payment_id}).then((_order)=>{
                            selectedDate.value = dayjs(_order.created_at).toDate()
                        })
                    }}
                >
                    {/* {flow.id} */}
                    {/* {JSON.stringify(flow)} */}
                    <div className="flex justify-between space-x-3">
                    <div className="min-w-0 flex-1">
                        <a className="block flex focus:outline-none">
                        <DeleteButton
                            className="cursor-pointer"
                            onClick={(e: any) => {
                                e.stopPropagation()
                                modalConfirmRemove.value = {
                                    ...modalConfirmRemove.value,
                                    open: true,
                                    actionAfterConfirm: ()=>{
                                        console.log('remove', flow.id);
                                        deleteMoneyFlow({id: flow.id}).then((data)=>{
                                            notify.success('Removido com sucesso.')
                                        }).catch((e)=>{
                                            notify.error(e.response?.data?.error || 'Erro ao remover.')
                                        })
                                    },
                                    id: flow.id
                                }
                            }}
                            sizeButton="4"
                            sizeIcon="4"
                        />
                        <span className="absolute" aria-hidden="true" />
                        <p className="line-clamp-2 pl-1 text-xs text-gray-600">
                            {flow.MoneyFlowCategory?.name || "Padrão"}
                        </p>

                        {/* <p className="text-sm text-gray-500 truncate">{message.subject}</p> */}
                        </a>
                    </div>
                    <time
                        dateTime={flow.created_at}
                        className="flex-shrink-0 whitespace-nowrap text-xs text-gray-500"
                    >
                        às {dayjs(flow.created_at).format("HH:mm")}
                    </time>
                    </div>
                    <div className="">
                    <div className="flex items-baseline justify-between">
                        <p className="text-md line-clamp-2 font-bold text-gray-700 text-left text-xs">
                            {flow.description || (flow.is_entrance ? "Entrada" : "Saída")}
                        </p>
                        <div className="ml-6 mt-0 flex flex-shrink-0 items-center justify-start justify-between">
                        {flow.is_entrance ? (
                            <span className="inline-flex items-center rounded-full bg-green-100  py-0.5 text-xs font-extrabold text-green-800">
                                {localMoney(flow.value)}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100  py-0.5 text-xs font-extrabold text-red-800">
                            - {localMoney(flow.value)}
                            </span>
                        )}
                        </div>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </div>
    )
}


const getTotals = () => ({
    ordersPaid: orders.value?.reduce(
      (acc: any, order: any) =>
        // !order.paid ? acc :
        acc +
        order?.OrderPayments?.reduce(
          (acc: any, payment: any) =>
            acc +
            (payment?.paid && payment.method === "MONEY" ? payment?.price : 0),
          0
        ),
      0
    ),
    moneyFlow: moneyFlowList?.value?.reduce(
      (acc: any, metric: any) =>
        acc + (metric.is_entrance ? metric.value : -metric.value),
      0
    ),
});