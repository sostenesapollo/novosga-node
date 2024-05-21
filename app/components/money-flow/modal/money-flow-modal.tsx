import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/components/hooks/use-media-query"
import { emptyOrder } from "../../orders/order"
import { useSignals } from "@preact/signals-react/runtime"
import MoneyFlow, { moneyFlow } from "../money-flow"
import { AddButtonCircle } from "@/components/generic/buttons/add-button-circle"

export default function ModalMoneyFlow({}: any) {

  const onClickClose = (newStatus) => { 
    if(newStatus === false) {
      moneyFlow.value = null;
    }
  };
  const resetMoneyFlowContent = () => { moneyFlow.value = emptyOrder as any };
  
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useSignals()

  if (isDesktop) {
    return (
      <Dialog open={moneyFlow.value} onOpenChange={onClickClose}>
        <DialogTrigger asChild>
          <AddButtonCircle
            onClick={()=>resetMoneyFlowContent()}
          />
        </DialogTrigger>
        <DialogContent onClickClose={onClickClose} className="sm:max-w-[500px] bg-muted">
          <MoneyFlow/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={moneyFlow.value} onOpenChange={onClickClose}>
      <DrawerTrigger asChild>
          <AddButtonCircle onClick={()=>resetMoneyFlowContent()}/>
      </DrawerTrigger>
      <DrawerContent className="w-full">
        <MoneyFlow/>
      </DrawerContent>
    </Drawer>
  )
}