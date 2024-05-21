// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import Order, { emptyOrder, order } from "@/components/orders/order";
// import { Button } from "../../ui/button";
// import { PlusCircle } from "lucide-react";
// import { useSignals } from "@preact/signals-react/runtime";

// export default function ModalOrder() {
//   useSignals();
//   return (
//     <Dialog open={!!order}>
//       <DialogTrigger>
//         <Button
//           size="sm"
//           variant="outline"
//           className="h-7 gap-1 bg-"
//           onClick={() => {
//             order = emptyOrder;
//           }}
//         >
//           <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
//           <span className="hidden xl:flex sm:whitespace-nowrap text-muted-foreground">
//             Nova venda
//           </span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="p-0" onClickClose={() => (order = null)}>
//         <Order />
//       </DialogContent>
//     </Dialog>
//   );
// }

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMediaQuery } from "@/components/hooks/use-media-query"
import Order, { emptyOrder, order } from "../order"
import { PlusCircle } from "lucide-react"
import { useSignals } from "@preact/signals-react/runtime"

export const resetOrderContent = () => { order.value = emptyOrder };

export default function ModalOrder() {

  const onClickClose = (newStatus) => { 
    if(newStatus === false) {
      order.value = null;
    }
   };

  const isDesktop = useMediaQuery("(min-width: 768px)")
  useSignals()

  if (isDesktop) {
    return (
      <Dialog open={!!order.value} onOpenChange={onClickClose}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 bg-"
            onClick={()=>resetOrderContent()}
          >
            <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden xl:flex sm:whitespace-nowrap text-muted-foreground">
              Nova venda
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1200px] bg-muted">
          <Order closeModal={onClickClose}/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={!!order.value} onOpenChange={onClickClose}>
      <DrawerTrigger asChild>
        <Button size="sm"
          variant="outline"
          className="h-7 gap-1 bg-"
          onClick={resetOrderContent}
        >
          <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden xl:flex sm:whitespace-nowrap text-muted-foreground">
            Nova venda
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Order closeModal={onClickClose}/>
      </DrawerContent>
    </Drawer>
  )
}