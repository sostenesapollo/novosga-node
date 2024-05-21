import { useSignalEffect } from "@preact/signals-react";
import { env } from "@/root";
import { connect, socket } from './index'
import { soundNotification } from "@/components/generic/sound-notification";
import { notify } from "@/components/generic/snackbar";

export function SocketEvents() {

  useSignalEffect(() => {
    if (env.value?.SOCKET_IO_SERVER === "" || env.value?.SERVER_URL === "")
      return;

    socket.value = connect();

    if (!socket) return;

    socket.value?.on("message", (data) => {
      if(data.type === 'info') {
        notify.info(data.message)
      }

      // orders.value =
      //   orders.value?.map((e) =>
      //     e.id === data.order_id ? { ...e, paid: data.paid } : e
      //   ) || [];

      // ordersFiltered.value = filterOrders();
    });


    return () => {
      socket.value?.close();
    };
  });
}