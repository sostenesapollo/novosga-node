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
import { dailyMetricsModal } from "@/routes/dashboard.orders"
import DailyMetrics from "../daily-metrics"

export const onClickClose = (newStatus: any) => { 
  if(newStatus === false) {
    dailyMetricsModal.value = {...dailyMetricsModal.value, show: false}
  }
};

export default function DailyMetricsModal({}: any) {
  
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useSignals()

  if (isDesktop) {
    return (
      <Dialog open={dailyMetricsModal.value?.show} onOpenChange={onClickClose}>
        <DialogContent onClickClose={onClickClose} className="sm:max-w-[800px] bg-muted">
          <DailyMetrics />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={dailyMetricsModal.value?.show} onOpenChange={onClickClose}>
      <DrawerContent className="w-full">
        <DailyMetrics />
      </DrawerContent>
    </Drawer>
  )
}