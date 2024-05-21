import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { useLoaderData } from "@remix-run/react";
import { socket } from "../dashboard";
import { notify } from "@/components/generic/snackbar";

export function meta() {
  return [{ title: "Vendas - Novo SGA" }];
}

export default function Dashboard() {
  useSignals();

  const data = useLoaderData()
  
  useSignalEffect(()=>{
    console.log('call next');
    notify.info
    socket.value?.emit('call-next', {data: 123})
  })

  return (
    <div className="flex flex-grow">
      ok
    </div>
  );
}
