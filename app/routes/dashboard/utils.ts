import { getUser } from "@/session.server";
import { redirect } from "@remix-run/node";
import dayjs from "dayjs";

export async function redirectIfNotLoggedIn({ request }: any) {
  const url = new URL(request?.url);
  const user = await getUser(request);

  if (!user.id) {
    throw redirect("/login");
  }

  const path = url.pathname;

  if (path === "/dashboard") {
    throw redirect("/dashboard/orders");
  }

  return { path, user, url };
}
