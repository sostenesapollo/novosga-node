import { UserAuthForm } from "@/routes/login/auth-form";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { redirect, useActionData } from "@remix-run/react";
import { getUser } from "@/session.server";
import { ActionFunctionArgs } from "@remix-run/node";
import { Header } from "@/components/header/header";
import { safeRedirect } from "@/lib/utils/utils";
import { json } from "@remix-run/server-runtime";
import * as argon2 from "argon2";
import { prisma } from "@/db.server";
import { createUserSession } from "@/session.server";
import { useEffect } from "react";
import { notify } from "@/components/generic/snackbar";

export function meta() {
  return [
    { title: "PedeGás - Entrar no sistema" },
    {
      description: "Página do parceiro, entrar no sistema",
    },
    {
      "og:title": "Página do parceiro, entrar no sistema",
    },
  ];
}

const testimonials = [
  {
    text: "Desde que comecei a usar o sistema tenho todos os meus clientes salvos e relatórios de vendas, posso dar brindes para os clientes que mais compram, eu super recomendo o Novo SGA ",
    owner: "Erinaldo Moreno - Cliente",
  },
  {
    text: "Ganhei agilidade e praticidade na minha empresa, super recomendo o Novo SGA",
    owner: "Ednalda Almeida - Cliente",
  },
  {
    text: "Já uso o sistema desde 2017, fui um dos primeiros clientes e não consigo imaginar o meu negócio sem um sistema de gestão como o Novo Sga Node",
    owner: "Welligton - Cliente",
  },
];

const include = { UserBaseCompanies: { include: { CompanyBase: true } } };

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let user = await getUser(request); // Just for switch accounts. TODO: move this to an if block

  if (user?.id) {
    // from token -> Switch Accounts
    return switchUserCompanyBase({
      request,
      user,
    });
  } else {
    // Login -> no user found in cookies
    const user = (await prisma.user.findFirst({
      where: { email },
      include,
    })) as any;

    // console.log(">>", user);

    const has_multiple_company_bases = user?.UserBaseCompanies?.length! > 1;

    if (!email?.length) {
      return json({ error: "O email é obrigatório." });
    }

    if (user && user.password.length) {
      const isPasswordValid = await argon2.verify(
        user.password,
        password || ""
      );

      if (isPasswordValid && user.profile_type !== "SUPERUSER") {
        if (!user.is_active) {
          return json(
            { error: "Este usuário encontra-se inativo." },
            { status: 401 }
          );
        }

        if (!user.UserBaseCompanies?.length) {
          return json(
            { error: "Usuário não possui nenhuma empresa vinculada." },
            { status: 401 }
          );
        }

        let redirectTo = safeRedirect("/dashboard/orders");

        if (user.profile_type === "SUPERUSER") {
          redirectTo = safeRedirect("/superuser/users");
        }

        return createUserSession({
          user,
          request,
          redirectTo,
          remember: true,
          has_multiple_company_bases,
        });
      }

      console.log("Senha incorreta");

      return json({ error: "Senha incorreta." }, { status: 401 });
    } else {
      console.log("mail not found");

      return json({ error: "Email não encontrado." }, { status: 401 });
    }
  }
};

export async function loader({ request }: any) {
  const user = await getUser(request);

  if (user.id) {
    if (user.profile_type === "SUPERUSER") return redirect("/superuser/users");
    return redirect("/dashboard/orders");
  }

  return {};
}

export default function AuthenticationPage() {
  const actionData = useActionData() as { error: string | null };

  useEffect(() => {
    notify.error(actionData?.error);
  }, [actionData]);

  return (
    <>
      <Header />
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="container relative hidden h-full flex-col px-0 mx-5 items-center text-white lg:flex ">
          {/* <div className="absolute inset-0 bg-zinc-900" /> */}
          <img
            src="/new-login.svg"
            alt=""
            className=" object-cover h-[500px] w-[520px] mt-6"
          />

          <div className="mt-3 ml-12">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
            >
              <CarouselContent className="text-black">
                {testimonials?.map(({ text, owner }) => (
                  <CarouselItem
                    className="cursor-pointer text-center"
                    key={owner}
                  >
                    <blockquote className="space-y-2">
                      <p className="text-lg pq text-muted-foreground">
                        &ldquo; {text} &rdquo;
                      </p>
                      <footer className="text-sm text-muted-foreground">
                        {owner}
                      </footer>
                    </blockquote>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious className="text-muted-foreground" /> */}
              {/* <CarouselNext className="text-muted-foreground" /> */}
            </Carousel>
          </div>
        </div>

        <div className="lg:p-8 flex h-full justify-center items-center">
          <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Painel empresarial
              </h1>
              <p className="text-sm text-muted-foreground">
                Digite seu email para acessar o sistema
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Ao clicar em continuar, você concorda com nossos{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Termos de serviço
              </a>{" "}
              e nossa{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Política de privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

async function switchUserCompanyBase(props: {
  user: { id: string; company_base_id: string };
  request: Request;
}) {
  let userCompanyBases;
  userCompanyBases = await prisma.user.findFirst({
    where: {
      UserBaseCompanies: {
        some: {
          user_id: props.user.id,
        },
      },
    },
    include: { UserBaseCompanies: { include: { CompanyBase: true } } },
  });

  const has_multiple_company_bases =
    (userCompanyBases?.UserBaseCompanies &&
      userCompanyBases?.UserBaseCompanies?.length > 1) === true;

  if (!userCompanyBases || userCompanyBases.UserBaseCompanies.length === 1)
    return json({
      errorField: "email",
      errors: ["Usuário não está em outras filiais."],
    });

  userCompanyBases = {
    ...userCompanyBases,
    UserBaseCompanies: userCompanyBases.UserBaseCompanies.filter(
      (e) => e.company_base_id !== props.user.company_base_id
    ),
  };

  return createUserSession({
    redirectTo: "/login",
    remember: true,
    request: props.request,
    user: userCompanyBases,
    has_multiple_company_bases,
  });
}
