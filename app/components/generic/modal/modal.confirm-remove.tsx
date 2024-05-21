import { Icons } from "@/components/icons/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { signal } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"

export const modalConfirmRemove = signal<{actionAfterConfirm: () => void, open: boolean}>({open: false, actionAfterConfirm: () => {}})

export function ModalConfirmRemoveGeneric({onClickDelete}: {onClickDelete?: () => void}) {
  useSignals()
  
  const onOpenChange = (open: boolean) => {
    console.log(open);
    if(!open) {
      modalConfirmRemove.value = { ...modalConfirmRemove.value, open: false }
    }
  }

  return (
    <AlertDialog open={modalConfirmRemove.value.open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="px-4 pb-4 pt-5 sm:p-2 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <Icons.ExclamationTriangleIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <AlertDialogTitle className="flex">
                Deseja realmente apagar ?
              </AlertDialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Você tem certeza que quer remover esse registro, essa
                  operação não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus={true}>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-primary-foreground" onClick={modalConfirmRemove.value.actionAfterConfirm}>Pode apagar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
