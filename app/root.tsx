import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { GlobalPendingIndicator } from "@/components/global-pending-indicator/global-pending-indicator";
import { Header } from "@/components/header/header";
import {
  ThemeSwitcherSafeHTML,
  ThemeSwitcherScript,
} from "@/components/theme/theme-switcher";
import "./globals.css";
import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaArgs,
} from "@remix-run/node";
import Snackbar from "./components/generic/snackbar";
import { serverUrl } from "./lib/utils/whatsapp-api-presets";
import { Button } from "./components/ui/button";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { Socket } from "socket.io";
import DebugTab from "./components/generic/debug-tab/debug-tab";
import "@preact/signals-react/auto";
import { useEffect, useRef } from "react";
import confetti from 'public/confetti.mp3'
import SoundNotification from "./components/generic/sound-notification";

export function meta(args: MetaArgs) {
  return [
    { title: "NovoSga Node" },
    {
      description:
        "O jeito mais prático de pedir seu gás de cozinha. Rápido e com melhor preço somente no Novo SGA. Ótimas availiações por toda a cidade.",
    },
    {
      "og:title":
        "O jeito mais prático de pedir seu gás de cozinha. Rápido e com melhor preço somente no Novo SGA. Ótimas availiações por toda a cidade.",
    },
  ];
}

export const links: LinksFunction = () => [
  { rel: "icon", href: "/pedegas-2.ico", type: "image/png" },
];

export function loader() {
  return {
    SOCKET_IO_SERVER:
      process?.env?.SOCKET_IO_SERVER ||
      "http://localhost:3000" ||
      "https://pedegas.com",
    SERVER_URL: serverUrl,
    NODE_ENV: process.env.NODE_ENV,
    SOCKET_IO_PORT: process.env.SOCKET_IO_PORT,
    WHATSAPP_TEST_NUMBER: process.env.WHATSAPP_TEST_NUMBER,
  };
}

export const env = signal<Awaited<ReturnType<typeof loader>>>({
  SOCKET_IO_SERVER: "",
  SERVER_URL: "",
  NODE_ENV: "development",
  SOCKET_IO_PORT: "3001",
  WHATSAPP_TEST_NUMBER: ''
});

export type ActionType = ActionFunctionArgs & { context: { io: Socket } };
export type LoaderType = LoaderFunctionArgs & {
  context: { io: Socket };
};

function App({ children }: { children: React.ReactNode }) {
  useSignals();

  env.value = useLoaderData() as any;

  return (
    <ThemeSwitcherSafeHTML lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeSwitcherScript />
      </head>
      <body className="vsc-initialized">
        <GlobalPendingIndicator />
        <SoundNotification />
        {children}
        <ScrollRestoration />
        <Scripts />
        <Snackbar />
        {/* {env.value?.NODE_ENV === "development" && <DebugTab />} */}
      </body>
    </ThemeSwitcherSafeHTML>
  );
}

export default function Root() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    status = error.status;
    switch (error.status) {
      case 400:
        message = "Eita diacho, aconteceu algum problema aqui.";
        break;
      case 404:
        message = "Página não encontrada.";
        break;
    }
  } else {
    console.error(error);
  }

  return (
    <App>
      <div className="container prose py-8">
        <h1>🫠 Erro {status}</h1>
        <p>{message}</p>
        <a href="/">
          <Button>Voltar ao início</Button>
        </a>
      </div>
    </App>
  );
}
