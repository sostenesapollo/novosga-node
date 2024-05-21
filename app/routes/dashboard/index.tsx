import { Link, Outlet, useMatches } from "@remix-run/react";
import Tooltip from "@/components/tooltip/tooltip";
import { Icons } from "@/components/icons/icons";
import ThemeSelector from "@/components/theme/theme-selector";
import { twMerge } from "tailwind-merge";
import { routesMapping, routesMappingBottom } from "./routes-mapping";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { env } from "@/root";
import { SocketEvents } from "./socket-events";

export function meta() {
  return [{ title: "Home - Novo SGA" }];
}

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
export const isLoading = signal(false);

export default function Dashboard() {
  const matches = useMatches();
  const { id: currentRoute } = matches[matches.length - 1];
  
  useSignals();
  SocketEvents();

  const isPainel = currentRoute === "/dashboard/painel";

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {isPainel && (
        <>
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
            <Link
              to="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-secondary text-lg font-semibold text-blue-700 md:h-8 md:w-8 md:text-base"
            >
              <Icons.Fire className="text-muted-foreground" />
            </Link>
            {routesMapping.map((route, i) => (
              <Tooltip content={route.name} key={`aside-map:${route.to}-${i}`}>
                <Link
                  key={`aside-map-link:${route.to}-${i}`}
                  to={route.to}
                  className={twMerge(
                    "flex h-9 w-9 items-center justify-center rounded-lg  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    currentRoute === route.path && "bg-muted"
                  )}
                >
                  <route.icon />
                </Link>
              </Tooltip>
            ))}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
            <ThemeSelector />
            {routesMappingBottom.map((route, i) =>
              route.to === "/logout" ? (
                <form action="/logout" method="post" key={`f-${i}`}>
                  <button>
                    <route.icon className=" text-muted-foreground" />
                  </button>
                  {/* <button type="submit">Sair do sistema</button> */}
                </form>
              ) : (
                <Tooltip content={route.name} key={`nav-map:${route.to}`}>
                  <Link
                    to={route.to}
                    className={twMerge(
                      "flex h-9 w-9 items-center justify-center rounded-lg  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                      currentRoute === route.path && "bg-muted-foreground"
                    )}
                  >
                    <route.icon />
                  </Link>
                </Tooltip>
              )
            )}
          </nav>
        </aside>
        <div className="flex flex-grow flex-col h-fit sm:gap-4 sm:py- sm:pl-14"></div>
      </>
      )}
      <Outlet />
    </div>
  );
}
