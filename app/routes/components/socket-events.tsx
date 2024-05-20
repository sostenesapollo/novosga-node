import { io } from "socket.io-client";
import { useSignalEffect } from "@preact/signals-react";
import { signal } from "@preact/signals-react";
import { env } from "../../root";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { useSignals } from '@preact/signals-react/runtime';

export function connect() {
  const host =
    process.env.NODE_ENV === "development"
      ? `http://localhost:${env.value.SOCKET_IO_PORT}`
      : env.value.SOCKET_IO_SERVER;

  console.warn("socket.io host:", host);

  return io(host || "", {
    port: env.value.SOCKET_IO_PORT, // TO make it work probably should touch on this.
    transports: ["websocket"],
  });
}

export const socket = signal(
  null as null | Socket<DefaultEventsMap, DefaultEventsMap>
);

export function SocketEvents() {
  useSignalEffect(() => {
    if (env.value?.SOCKET_IO_SERVER === "" || env.value?.SERVER_URL === "")
      return;

    socket.value = connect();

    if (!socket) return;

    return () => {
      socket.value?.close();
    };
  });
}