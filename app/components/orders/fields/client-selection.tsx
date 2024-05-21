import { Label } from "@/components/ui/label";
import { order } from "../order";
import ClientAutocomplete from "@/components/generic/autocomplete/client/client-autocomplete";
import { AddButtonCircle } from "@/components/generic/buttons/add-button-circle";
import { client, emptyClient } from "@/components/client/client";
import { useSignals } from "@preact/signals-react/runtime";

export function ClientSelection({externallySetText = ''}) {
  const add = () => {
    client.value = emptyClient
  }

  useSignals()
  return (
    <section className="flex flex-col space-y-1.5">
      <div className="flex justify-between items-center">
        <Label htmlFor="name">Cliente</Label>
        <AddButtonCircle onClick={add} />
      </div>

      <span className="text-muted-foreground text-xs hidden sm:block">
        Separe por vírgula(,) para ultilizar múltiplos filtros
      </span>
      <ClientAutocomplete
        value={order.value?.client_id as any}
        setSelected={(id) => {
          console.log("id", id);
          order.value = { ...order.value, client_id: id, client_name: null } as any;
        }}
        externallySetText={externallySetText}
      />
    </section>
  );
}
