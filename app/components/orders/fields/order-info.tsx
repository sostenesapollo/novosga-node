import { Card} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CardContent } from "@/components/new-york/ui/card";
import { order } from "../order";
import { localMoney } from "@/lib/utils/currency";
import { addPhoneMask, getOrderTotal, serializeAddressNoNeighborhood } from '../../../lib/utils/utils';
import dayjs from "dayjs";
import { EditButton } from '../../generic/buttons/edit-button';
import { client } from "@/components/client/client";
import { useEffect, useState } from "react";
import { getClientInfosById } from "@/api/clients";
import { twMerge } from "tailwind-merge";
import { selectedDate } from "../orders-table";
import {signal} from "@preact/signals-react";

const clientInfoSpecific = signal(null) as any

export function OrderInfos() {
  useEffect(()=>{
    clientInfoSpecific.value = null;
    if(order.value?.Client?.id) {
      getClientInfosById(order.value?.Client?.id).then(data=>{
        clientInfoSpecific.value = data as any
      })
    }
  },[])

  const rows = clientInfoSpecific.value?.orders || []

  return (
      <Card className="overflow-hidden">

        <CardContent className=" text-sm p-2">
          <div className="grid">
            <div className="font-semibold pb-2">Detalhes da venda</div>
            <ul className="grid max-h-[200px] overflow-auto">
              {order.value?.OrderProducts.map((product, index) => (
                  <span key={`--${index}`}>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold truncate">
                    {product.Product?.name ? product.Product?.name?.substring(0, 28) : 'SELECIONE UM PRODUTO'}
                  </span>
                  <span>
                    x <span>{product.quantity}</span>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total do ítem</span>
                  <span>{localMoney(product.unit_price * product.quantity)}</span>
                </li>
                <Separator className=""/>
              </span>
              ))}
            </ul>
            <Separator className=""/>
            <ul className="grid  pt-2">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total da venda</span>
                <span>{localMoney(getOrderTotal(order.value))}</span>
              </li>
            </ul>
          </div>

          {order.value?.Client && (
              <>
                <Separator className="mt-2"/>
                <div className="grid ">
            <span className="flex justify-between">
              <div className="font-semibold">Dados do clientes</div>
              <EditButton onClick={() => {
                client.value = {...order.value?.Client} as any
              }}/>
            </span>
                  <dl className="grid ">
                    <div className="flex flex-col justify-between">
                      <dt className="text-muted-foreground">Nome</dt>
                      <dd>{order.value?.Client?.name}</dd>
                    </div>
                    {order.value?.Client.Street && (
                        <div className="flex flex-col justify-between">
                          <dt className="text-muted-foreground">Endereço</dt>
                          <dd>{serializeAddressNoNeighborhood(order.value?.Client)}</dd>
                          <dd>{order.value?.Client?.Street?.Neighborhood?.name}</dd>
                        </div>
                    )}
                    {order.value?.Client?.whatsapp || order.value?.Client?.phone || order.value?.Client?.phone2 && (
                        <div className="flex flex-col justify-between">
                          <dt className="text-muted-foreground">Contato</dt>
                          <dd>{addPhoneMask(order.value?.Client?.whatsapp as any)}</dd>
                          <dd>{addPhoneMask(order.value?.Client?.phone || order.value?.Client?.phone2)}</dd>
                        </div>
                    )}
                    <div className="flex flex-col justify-between">
                      <dt className="text-muted-foreground">Cliente desde</dt>
                      <dd>{dayjs(order.value?.Client?.created_at).format('DD/MM/YYYY')}</dd>
                    </div>
                  </dl>
                </div>
              </>
          )}
        </CardContent>

        {order.value?.Client && (
            <span className="mx-2">
          <Separator className="my-1"/>
          <div className="grid mx-2">
            <span className="flex justify-between">
              <div className="font-semibold text-xs">Ultimas vendas</div>
            </span>
            <span className="overflow-auto max-h-[150px]">
              <RenderOrders orders={rows}/>
            </span>
            <span className="text-right">
              <div className="font-semibold text-xs">
                {`Total de vendas: ${clientInfoSpecific.value?.totalOrders || 0}`}
                <p></p>
                Última em {dayjs(clientInfoSpecific?.orders?.at(0)?.created_at).format('DD/MM/YYYY')}
              </div>
            </span>
          </div>
        </span>
        )}
      </Card>
  );
}

function RenderOrders(data) {
  return (
      data.orders?.length > 0 ? data.orders?.map((order, index)=>(
        <div className="grid hover:bg-muted" key={`RenderOrders${index}`}>
          <div className="flex flex-col justify-between text-xs">
            <div className="flex flex-row justify-between text-xs cursor-pointer" onClick={()=> { selectedDate.value = order.created_at}}>
              <div className={twMerge(order.paid ? 'bg-green-400' : 'bg-red-400')}>
                {dayjs(order.created_at).format('DD/MM/YYYY')}
              </div>
              <div className={twMerge(order.paid ? 'bg-green-400' : 'bg-red-400')}>
                {localMoney(getOrderTotal(order))}
              </div>
            </div>
            <dt className="text-muted-foreground">
              {order.OrderProducts.length > 1 ? `${order.OrderProducts.length} produtos` : `${order.OrderProducts[0].Product.name}`}
            </dt>
          </div>
        </div>
      )) : "Nenhuma venda."
  )
}