import { redirectIfNotLoggedIn } from "../dashboard/utils";

export async function loaderDashboardSettings({ request, context }: any) {
  const { user } = await redirectIfNotLoggedIn({ request });

  return { user };
}
