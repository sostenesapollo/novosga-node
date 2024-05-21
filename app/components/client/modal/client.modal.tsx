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
import { useSignals } from "@preact/signals-react/runtime"
import Client, { client, emptyClient } from "../client"

export default function ClientModal({}: any) {

  const onClickClose = (newStatus) => { 
    if(newStatus === false) {
      client.value = null;
    }
  };
  
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useSignals()

  if (isDesktop) {
    return (
      <Dialog open={client.value} onOpenChange={onClickClose}>
        <DialogContent onClickClose={onClickClose} className="sm:max-w-[500px] bg-muted">
          <Client />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={client.value} onOpenChange={onClickClose}>
      <DrawerContent className="w-full">
        <Client />
      </DrawerContent>
    </Drawer>
  )
}