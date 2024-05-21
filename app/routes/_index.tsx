import { UserAuthForm } from "@/routes/login/auth-form";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { redisClient } from "@/lib/redis.server";
import { SelectZipcode } from "@/components/select-zipcode/select-zipcode";
import { Header } from "@/components/header/header";
// import { useLoaderData } from "@remix-run/react";
// import { SelectZipcode } from "@/components/select-zipcode";
// import { useSocket } from "@/lib/context/socket-context";

export function meta() {
  return [
    { title: "Home - Novo Sga Node" },
    {
      description: "Página do parceiro, entrar no sistema",
    },
    {
      "og:title": "Página do parceiro, entrar no sistema",
    },
  ];
}

export async function loader() {
  try {
    let data = await redisClient.get("test");
    if (!data) {
      data = await redisClient.set("test", new Date().toDateString());
    }
    return { data };
  } catch (e) {
    console.log("error", e);
  }
}

export default function AuthenticationPage() {
  const testimonials = [
    {
      text: "O que eu mais gosto do Novo SGA é que ele já salva os meus dados, não precisa ficar colocando em todas as vendas.",
      owner: "Avaliação de Larissa Trindade",
      stars: 5,
    },
    {
      text: "Adoro o acompanhamento do pedido em tempo real. É ótimo saber exatamente quando meu pedido será entregue, especialmente quando estou ocupado com outras coisas em casa ou no trabalho.",
      owner: "Avaliação de Josy",
      stars: 5,
    },
    {
      text: "A possibilidade de programar entregas recorrentes. Com essa função, não preciso me preocupar em lembrar de fazer pedidos repetidos toda vez que meu gás acaba. O aplicativo cuida disso para mim, garantindo que nunca fique sem gás.",
      owner: "Avaliação de José",
      stars: 4,
    },
  ];

  return (
    <>
      <Header />
      <div className="md:container relative   flex-col items-center justify-center xl:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* lg:p-8 flex max-w-2xl px-4 sm:px-6 sm:py-2 lg:max-w-7xl  */}
       
      </div>

      {/*  */}
    </>
  );
}

const StarFull = () => (
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-yellow-600 cursor-pointer"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      ></path>
    </svg>
  </span>
);

const StarEmpty = () => (
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 cursor-pointer text-blue-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      ></path>
    </svg>
  </span>
);

const Stars = ({ quantity = 4 }) => {
  let stars = <></>;
  if (quantity === 5) {
    stars = (
      <>
        <StarFull />
        <StarFull />
        <StarFull />
        <StarFull />
        <StarFull />
      </>
    );
  } else if (quantity === 4) {
    stars = (
      <>
        <StarFull />
        <StarFull />
        <StarFull />
        <StarFull />
        <StarEmpty />
      </>
    );
  }

  return (
    <div className="">
      <div className="inline-flex items-center">{stars}</div>
    </div>
  );
};
