import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import type {
	CompanyBase,
	CompanyBusinessTypes,
	ProfileType,
	User,
	UserBaseCompanies,
} from "@prisma/client";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export type userFromCookie =
	| (User & { UserBaseCompanies: UserBaseCompanies[] })
	| null;
export type createUserSessionParams = {
	request: Request;
	user:
		| (User & {
				UserBaseCompanies: (UserBaseCompanies & {
					CompanyBase: CompanyBase;
				})[];
		  })
		| null;
	remember: boolean;
	redirectTo: string;
	has_multiple_company_bases?: boolean;
};

export type CookieParams = {
	id: string;
	company_base_id: string;
	company_id: string;
	business_type: CompanyBusinessTypes;
	name: string;
	profile_type: ProfileType;
	city_id: string;
	has_multiple_company_bases: boolean;
	base_name: string;
	timezone: number;
	whatsappApiUrl?: string;
};

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__session",
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secrets: [process.env.SESSION_SECRET],
		secure: process.env.NODE_ENV === "production",
	},
});

export async function getSession(request: Request) {
	const cookie = request.headers.get("Cookie");
	return sessionStorage.getSession(cookie);
}

export async function getUser(request: Request): Promise<CookieParams> {
	const session = await getSession(request);
	return session.data as any;
}

export const getRequestUser = (request: Request) => getUser(request);

const setSessionValues = async ({
	request,
	...params
}: { request: any; fields: CookieParams }) => {
	const session = await getSession(request);
	for (let [key, value] of Object.entries(params?.fields)) {
		session.set(key, value);
	}
	return session;
};

export async function createUserSession({
	request,
	remember,
	...params
}: createUserSessionParams) {
	if (!params.user) return;

	if (
		params.user.profile_type === "ADMIN" ||
		params.user.profile_type === "PROFESSIONAL"
	) {
		if (!params.user.UserBaseCompanies[0]?.CompanyBase?.city_id)
			throw new Error("Cidade da empresa não definida");
	}

	const session = await setSessionValues({
		request,
		fields: {
			id: params.user?.id,
			company_base_id: params?.user.UserBaseCompanies[0]?.company_base_id,
			company_id: params.user?.UserBaseCompanies[0]?.company_id,
			timezone: params?.user?.UserBaseCompanies[0]?.CompanyBase?.timezone,
			business_type:
				params.user.UserBaseCompanies[0]?.CompanyBase?.company_business_type,
			name: params.user.name,
			profile_type: params.user.profile_type,
			city_id: params.user.UserBaseCompanies[0]?.CompanyBase?.city_id || "",
			has_multiple_company_bases: params?.has_multiple_company_bases === true,
			base_name:
				params?.user.UserBaseCompanies[0]?.CompanyBase?.base_name || "",
		},
	});

	const cookie = await sessionStorage.commitSession(session, {
		maxAge: remember
			? 60 * 60 * 24 * 7 // 7 days
			: undefined,
	});

	if (params.redirectTo) {
		// console.log("redirect", params.redirectTo, { cookie });
		return redirect(params.redirectTo, {
			// status: 201,
			headers: {
				"Set-Cookie": cookie,
			},
		});
	}

	return { cookie, ProfileType: params.user.profile_type };
}

export async function logout(request: Request) {
	const session = await getSession(request);

	return redirect("/login", {
		headers: {
			"Set-Cookie": await sessionStorage.destroySession(session),
		},
	});
}
