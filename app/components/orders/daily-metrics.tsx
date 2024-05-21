import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { Button } from "@/components/ui/button";
import { onClickClose } from "./modal/daily-metrics.modal";
import { INPLACE_COLOR, metrics, selectedDate, selectedOrders } from "./orders-table";
import { dailyMetricsModal, updateSelectedDate } from "@/routes/dashboard.orders";
import dayjs from "dayjs";
import { getReports } from "@/api/order";
import { DailyReportsType } from "@/routes/api.list/getReports";
import { Circle } from "../generic/circle";
import { localMoney } from "@/lib/utils/currency";
import { DatePicker } from "../generic/date-picker";
import { isLoading } from "@/routes/dashboard";

export default function DailyMetrics() {
  useSignals();

  useSignalEffect(()=>{
    getReports(selectedDate.value).then((result)=>{
      dailyMetricsModal.value = {...dailyMetricsModal.value, reports: result  }
    })
  })

  return (
    <>
      {/* <CardHeader className="p-1 lg:px-4">
        <CardTitle className="text-primary flex items-center pt-2">
          Relatórios do dia
        </CardTitle>
      </CardHeader> */}

      <CardContent className="p-1 lg:px-4 overflow-auto max-h-[800px]">
        <div className={"w-full lg:space-x-2 pb-2"}>

          <DailyReportsData dailyReports={dailyMetricsModal.value?.reports}/>

          <div className="flex flex-row fllex-grow">
            <Button variant="outline" className="mt-2 w-full mr-1" onClick={()=>onClickClose(false)}>
              Fechar
            </Button>
          </div>
        </div>
        
      </CardContent>
    </>
  );
}

function DailyReportsData ({dailyReports={} as DailyReportsType}) {
  return (
    <>
      <div className="relative flex overflow-auto max-h-[40vh]">
        <table className="table-fixed  divide-y divide-gray-200 grow">
          <thead className="bg-gray-100">
              <tr key='-1'>
                <th key="Name" scope="col" className="pl-3 pt-2 pb-2 top-0 bg-gray-100 md:p-4 text-left text-md font-medium text-gray-500 md:uppercase max-w-[5vw]">
                  Entregador & produto
                </th>
                <th key='Cheios' scope="col" className="top-0 bg-gray-100 md:p-4 pr-2 md:pr-0 pl-2 md:pl-0 text-center  text-md font-medium text-gray-500 md:uppercase">
                  Quantidade
                </th>
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">


            <tr key={'ff'} style={{backgroundColor: INPLACE_COLOR}}>
              <td className="md:p-1 whitespace-nowrap text-xs text-base font-medium text-gray-900">
                Portaria
              </td>
              <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
              </td>
            </tr>

            {
            Object.entries(dailyReports?.totalsInplace || {})?.length > 0 ?
            Object.entries(dailyReports?.totalsInplace || {})?.map(([k, v]: any, index: any)=>(
              <tr key={index}>
                <td className="md:p-1 whitespace-nowrap text-xs text-base font-medium text-gray-900 flex">
                  <Circle color={INPLACE_COLOR} borderActive={true} className="mr-2" /> {k}
                </td>
                <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
                  {v}
                </td>
              </tr>
            )) : 
            <tr key="-23">
              <td className="md:p-1 whitespace-nowrap text-xs text-base font-medium text-gray-900 flex">
                Nenhuma venda na portaria
              </td>
              <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
                  0
              </td>
            </tr>
            }      

            {dailyReports?.byDeliveryman?.map(([e, values]: any, index: any)=>
              <>
                <tr className="hover:bg-gray-200 text-center cursor-pointer" key={index} onClick={()=>{printDeliverymanReport(e, values)}}>
                  <td className="md:p-1 text-left text-xs text-base font-medium text-gray-900" style={{backgroundColor: values['color']}}>
                    {e}
                  </td>
                  <td className="md:p-1 text-left text-xs text-base font-medium text-gray-900" style={{backgroundColor: values['color']}}>

                  </td>
                </tr>

                {Object.entries(values.results || {})?.map(([k, v]: any, index2: any)=>(
                  <tr key={index2}>
                    <td className="md:p-1 text-left break-words whitespace-nowrap text-xs text-base font-medium text-gray-900 flex">
                      <Circle color={values['color']} borderActive={true} className="mr-2"/> {k}
                    </td>
                    <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
                      {v}
                    </td>
                  </tr>
                ))}
              </>
            )}

            <tr key={'ff'} className='bg-gray-300'>
              <td className="md:p-1 whitespace-nowrap text-xs text-base font-medium text-gray-900">
                Totais
              </td>
              <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
              </td>
            </tr>
            { Object.entries(dailyReports?.totals || {}).length === 0 ? (
              <tr key="-25">
                <td className="md:p-1whitespace-nowrap text-xs text-base font-medium text-gray-900 flex">
                  Nenhuma venda
                </td>
                <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
                    0
                </td>
              </tr>) : 
              Object.entries(dailyReports?.totals || {})?.map(([k, v]: any, index: any)=>(
                <tr key={index}>
                  <td className="md:p-1 whitespace-nowrap text-xs text-base font-medium text-gray-900 flex">
                    <Circle color={"gray"} borderActive={true} className="mr-2"/> {k}
                  </td>
                  <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900">
                    {v}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>     
      </div>
    
      <div className='flex flex-col'>
        <span className='flex justify-between'>
          <h3 className='font-bold text-xs pt-2' >
            Relatórios do dia {dayjs(selectedDate.value).format('DD/MM/YYYY')}
          </h3>
          <span className="pt-1">
          <DatePicker
            date={selectedDate.value}
            setDate={updateSelectedDate}
            loading={isLoading.value}
          />
          </span>
        </span>
        <span className="text-muted-foreground text-xs">
          (Somente formas de pagamentos pagas)
        </span>

        <table className="divide-y divide-gray-200 grow mt-4">
          <thead className="bg-gray-100">
              <tr key='-1'>
                <th key="Name" scope="col" className="pl-3 pt-2 pb-2 bg-gray-100 md:p-4 text-left text-md font-medium text-gray-500 md:uppercase">
                  Método
                </th>
                <th key='Cheios' scope="col" className="bg-gray-100 md:p-4 pr-2 md:pr-0 pl-2 md:pl-0 text-center  text-md font-medium text-gray-500 md:uppercase">
                  Quantidade
                </th>
                <th key='Cheios' scope="col" className="bg-gray-100 md:p-4 pr-2 md:pr-0 pl-2 md:pl-0 text-center  text-md font-medium text-gray-500 md:uppercase">
                  Valor total
                </th>
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(dailyReports?.byPaymentMehod || {})?.map(([e, values]: any, index: any)=>
              <>
                <tr
                  className="hover:bg-gray-200 text-center cursor-pointer"
                  key={index}
                  onClick={()=>{printDeliverymanReport(e, values)}}
                >
                  <td className="md:p-1 text-left ml-4 whitespace-nowrap text-xs text-base font-medium text-gray-900" style={{backgroundColor: values['color']}}>
                    <span className='pl-4 truncate'>
                      {values.name}
                    </span>
                  </td>
                  <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900" style={{backgroundColor: values['color']}}>
                    {JSON.stringify(values?.results?.quantity)}
                  </td>
                  <td className="md:p-1 text-center whitespace-nowrap text-xs text-base font-medium text-gray-900" style={{backgroundColor: values['color']}}>
                    {localMoney(values?.results?.total)}
                  </td>
                </tr>

              
              </>
            )}
          </tbody>
        </table>
      </div>    
    </>
  )
}