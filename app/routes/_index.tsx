import { json, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Iot Cultivo API" },
    { name: "description", content: "Iot Cultivo API" },
  ];
};

export default function Main() {
  return <>Novo SGA node</>
}

