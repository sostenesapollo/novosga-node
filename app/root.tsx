import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./tailwind.css";
import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { serverUrl } from './utils';

export function loader() {
  return {
    SOCKET_IO_SERVER:
      process?.env?.SOCKET_IO_SERVER ||
      "http://localhost:3000" ||
      "https://pedegas.com",
    SERVER_URL: serverUrl,
    NODE_ENV: process.env.NODE_ENV,
    SOCKET_IO_PORT: process.env.SOCKET_IO_PORT,
  };
}

export const env = signal<Awaited<ReturnType<typeof loader>>>({
  SOCKET_IO_SERVER: "",
  SERVER_URL: "",
  NODE_ENV: "development",
  SOCKET_IO_PORT: "3001",
});

export function Layout({ children }: { children: React.ReactNode }) {
  useSignals();
  env.value = useLoaderData() as any;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
