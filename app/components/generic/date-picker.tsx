import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import br from "date-fns/locale/pt-BR";
import LoadingSpinner from "./loading-spinner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { selectedAll, selectedDate, selectedOrders } from "../orders/orders-table";
import dayjs from "dayjs";
import { useSignalEffect } from "@preact/signals-react";

type T = {
  date: Date | null;
  setDate: any;
  loading: boolean;
};

export function DatePicker({ date, setDate = () => {}, loading = false }: T) {

  const subtractOneDay = (e: any) => {
    e.preventDefault();
    selectedDate.value = dayjs(selectedDate.value).subtract(1, "day").toDate();
  }

  const addOneDay = (e) => {
    e.preventDefault();
    selectedDate.value = dayjs(selectedDate.value)
      .add(1, "day")
      .toDate();
  }

  useSignalEffect(()=>{
    if(selectedDate.value) {
      selectedOrders.value = []
      selectedAll.value = false
    }
  })

  return (
    <Popover>
      <span className="text-center items-center flex">
        <Button size="sm" variant="outline" className="rounded-none rounded-l-lg px-0" onClick={subtractOneDay}>
          <ArrowLeft className="mx-2 text-muted-foreground"/>
        </Button>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-none px-0">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <CalendarIcon className="h-3.5 w-3.5 ml-3 mr-3 xl:mr-0 text-muted-foreground" />
          )}
          <span className="hidden xl:flex sm:whitespace-nowrap text-muted-foreground mr-3">
            {date ? (
              format(date, "PPP", { locale: br as any })
            ) : (
              <span>Selecione uma Data</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <Button size="sm" variant="outline" className="rounded-none rounded-r-lg px-0" onClick={addOneDay}>
        <ArrowRight className="mx-2 text-muted-foreground"/>
      </Button>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || new Date()}
          onSelect={setDate}
          initialFocus
          locale={br}
        />
      </PopoverContent>
      </span>
    </Popover>
  );
}
