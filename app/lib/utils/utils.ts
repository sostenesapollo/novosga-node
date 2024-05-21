import type { CompanyBusinessTypes, Product, User } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { default as _dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import axios from "axios";
import type { CookieParams } from "@/session.server";
import { localMoney } from "./currency";
import { Redis } from "ioredis";

_dayjs.extend(utc);
_dayjs.extend(isToday);

export type eType = React.FormEvent<HTMLInputElement>;

const DEFAULT_REDIRECT = "/";

export const formatFilenameWithBucket = (filename: string) =>
	typeof filename === "string"
		? filename?.includes("http")
			? filename
			: `https://pedegasfiles.s3.amazonaws.com/${filename}`
		: null;

// export const getCitiesUsingStateCode = (stateCode: string) => axios.get(`https://brasilapi.com.br/api/ibge/municipios/v1/${stateCode}?providers=dados-abertos-br`)

const contactNumber = `9988284904`;

export const whatsappContactUsURL = `https://wa.me/${contactNumber}?text=Oi%2C%20quero%20realizar%20um%20pedido`;
export const whatsappContactBusinessUsURL = `https://wa.me/${contactNumber}?text=Oi%2C%20quero%20falar%20sobre%20o%20Pedegas`;

export const sendWhatsappTextMessage = (phone: string, text: string, whatsappClient: string, whatsappApiUrl="") => {
	return axios.post(`${whatsappApiUrl}/message`, {
	  chat: whatsappClient,
	  message: {
		type: "text",
		text: text
	  },
	  phone: phone
	});
  }

export const validateWhatsappClient = async (whatsappClient: string) => {
	const result = await axios.get("");
	return result;
};

export function getBody(request: Request): Promise<unknown> {
	return request.json();
}

export function base64MimeType(encoded?: any) {
	var result = null;

	if (typeof encoded !== "string") {
		return result;
	}

	var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

	if (mime && mime.length) {
		result = mime[1];
	}

	return result;
}

export function getB64extension(b64: string) {
	return b64.substring("data:image/".length, b64.indexOf(";base64"));
}

const wait = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(() => resolve(true), ms);
	});

export const retryWithDelay = (
	operation: any,
	retries = 3,
	delay = 50,
	finalErr = undefined,
) =>
	new Promise((resolve, reject) => {
		return operation()
			.then(resolve)
			.catch((e: any) => {
				//if retries are left
				if (retries > 0) {
					//delay the next call
					return (
						wait(delay)
							//recursively call the same function to retry with max retries - 1
							.then(
								retryWithDelay.bind(
									null,
									operation,
									retries - 1,
									delay,
									finalErr || e?.response?.data || e,
								),
							)
							.then(resolve)
							.catch(reject)
					);
				}

				// throw final error
				return reject(finalErr);
			});
	});

export const moneyStringToFloat = (value: string | number) => {
	if (value && typeof value === "string") {
		const currencyString = value as string;
		const cleanedString = currencyString.replace(/[R$.]/g, "");
		return parseFloat(cleanedString.replace(",", "."));
	}

	return value;
};

export const getOrderTotal = (order: any) =>
	order?.OrderProducts?.reduce((sum: any, curr: any) => {
		if(typeof curr.unit_price === 'number') {
			return ((curr.unit_price || 0) * parseFloat(curr?.quantity || 0)) + sum;
		}

		if (typeof curr.price === "string") {
			const currencyString = curr.price as string;
			const cleanedString = currencyString.replace(/[R$.]/g, "");
			const number = parseFloat(cleanedString.replace(",", "."));
			console.log({ number, cleanedString });

			return number * (curr?.quantity || 0) + sum;
		}
		return curr.price * (curr?.quantity || 0) + sum;
	}, 0);

export const formatOrderProducts = (products: Product[], orderProducts: any) =>
	orderProducts
		?.map(
			(e: any) =>
				`*${e.quantity}x* ${
					products.find((f) => f.id === e.product_id)?.name
				} - ${localMoney(e.unit_price)}`,
		)
		.join("\n");

export const getOrderSuccessfullyCreatedMessageBody = (
	orderNumber: string,
	clientName: string,
	products: Product[],
	body?: any,
) => {
	return [
		`🆕 *PEDIDO #${orderNumber}* 🆕`,
		` `,
		`Olá *${clientName}*, recebemos seu pedido aguarde a aprovação!`,
		` `,
		`📄 *Resumo do pedido* `,
		formatOrderProducts(products, body.items),
		` `,
		`*Forma de pagamento:* ${
			body.OrderPayments?.length
				? getPaymentMethod(body.OrderPayments[0].method)
				: "Não definida."
		}`,
		`*Total*: ${localMoney(
			body.OrderPayments?.length
				? body?.OrderPayments[0].price
				: "Não definido.",
		)}`,
		` `,
		`👤 *Dados do Cliente*`,
		body.Client?.name ? "Nome: " + body.Client?.name : null,
		body.Client?.address?.cep ? "CEP: " + body.Client?.address?.cep : null,
		body.Client?.address?.city ? "Cidade: " + body.Client?.address?.city : null,
		body.Client?.address?.state
			? "Estado: " + body.Client?.address?.state
			: null,
		body.priceComparisionAddressBase?.city
			? "Cidade: " + body.priceComparisionAddressBase?.city
			: null,
		body.priceComparisionAddressBase?.state
			? "Estado: " + body.priceComparisionAddressBase?.state
			: null,
		body.Client?.address?.neighborhood ||
		body.Client?.Street?.Neighborhood?.name
			? "Bairro: " +
			  (body.Client?.address?.neighborhood ||
					body.Client?.Street?.Neighborhood?.name)
			: null,
		body.Client?.address?.street
			? "Rua: " + body.Client?.address?.street
			: null,
		body.Client?.number ? "Número: " + body.Client?.number : null,
		body.Client?.reference
			? "Ponto de referência: " + body.Client?.reference
			: null,
		body.Client?.phone ? "Telefone: " + addPhoneMask(body.Client?.phone) : null,
	]
		.filter((e) => e)
		.join("\n");
};

export const formatOrderProductsUsingOnlyOrder = (orderProducts: any) =>
	orderProducts
		?.map(
			(e: any) =>
				`*${e.quantity}x* ${e.Product?.name} - ${localMoney(
					e.unit_price || e.price,
				)}`,
		)
		.join("\n");

export const getOrderMessageBody = (body?: any, returnArray = false) => {
	const street =
		body.Client?.address?.street ||
		body.Client?.Street?.name ||
		body.Client?.street;
	const phone =
		body.Client?.phone || body.Client?.phone2 || body.Client?.whatsapp;
	const neighborhood =
		body.Client?.address?.neighborhood ||
		body.Client?.Street?.Neighborhood?.name ||
		body.Client?.neighborhood;
	const a = [
		`📄 *Nova entrega recebida*`,
		` `,
		formatOrderProductsUsingOnlyOrder(body.OrderProducts),
		` `,
		`*Forma de pagamento:* ${
			body.OrderPayments?.length
				? getPaymentMethod(body.OrderPayments[0].method)
				: "Não definida."
		}`,
		`*Total*: ${localMoney(
			body.OrderPayments?.length
				? body?.OrderPayments[0].price
				: "Não definido.",
		)}`,
		` `,
		`👤 *Dados do Cliente*`,
		body.Client?.name ? `Nome: *${body.Client?.name}*` : null,
		neighborhood ? `Bairro: *${neighborhood}*` : null,
		street ? `Endereço: *${street}*` : null,
		body.Client?.number ? `Número: *${body.Client?.number}*` : null,
		body.Client?.reference
			? `Ponto de referência: *${body.Client?.reference}*`
			: null,
		phone ? "Telefone: " + addPhoneMask(phone) : null,
	];
	if (returnArray) return a;

	return a.filter((e) => e).join("\n");
};

export const getOrderMessageBodyDeliveryman = (body?: any) => {
	const street =
		body.Client?.address?.street ||
		body.Client?.Street?.name ||
		body.Client?.street;
	const phone =
		body.Client?.phone || body.Client?.phone2 || body.Client?.whatsapp;
	const neighborhood =
		body.Client?.address?.neighborhood ||
		body.Client?.Street?.Neighborhood?.name ||
		body.Client?.neighborhood;
	const a = [
		// `👤 *Dados do Cliente*`,
		body.Client?.name ? `Nome: *${body.Client?.name}*` : null,
		neighborhood ? `Bairro: *${neighborhood}*` : null,
		street ? `Endereço: *${street}*` : null,
		body.Client?.number ? `Número: *${body.Client?.number}*` : null,
		body.Client?.reference
			? `Ponto de referência: *${body.Client?.reference}*`
			: null,
		phone ? "Telefone: " + addPhoneMask(phone) : null,
		` `,
		formatOrderProductsUsingOnlyOrder(body.OrderProducts),
		` `,
		`*Forma de pagamento:* ${
			body.OrderPayments?.length
				? getPaymentMethod(body.OrderPayments[0].method)
				: "Não definida."
		}`,
		`*Total*: ${localMoney(
			body.OrderPayments?.length
				? body?.OrderPayments[0].price
				: "Não definido.",
		)}`,
		` `,
	];

	return a.filter((e) => e).join("\n");
};


export const getOrderMessageBodyDeliverymanPaidOrders = (body?: any) => {
	const street =
		body.Client?.address?.street ||
		body.Client?.Street?.name ||
		body.Client?.street;
	const phone =
		body.Client?.phone || body.Client?.phone2 || body.Client?.whatsapp;
	const neighborhood =
		body.Client?.address?.neighborhood ||
		body.Client?.Street?.Neighborhood?.name ||
		body.Client?.neighborhood;
	const a = [
		// `👤 *Dados do Cliente*`,
		`*✅ VENDA PAGA*`,
		// body.Client?.name ? `Nome: *${body.Client?.name}*` : null,
		// neighborhood ? `Bairro: *${neighborhood}*` : null,
		street ? `Endereço: *${street}*` : null,
		body.Client?.number ? `Número: *${body.Client?.number}*` : null,
		// body.Client?.reference
		// 	? `Ponto de referência: *${body.Client?.reference}*`
		// 	: null,
		// phone ? "Telefone: " + addPhoneMask(phone) : null,
		` `,
		formatOrderProductsUsingOnlyOrder(body.OrderProducts),
		// ` `,
		`*Forma de pagamento:* ${
			body.OrderPayments?.length
				? getPaymentMethod(body.OrderPayments[0].method)
				: "Não definida."
		}`,
		`*Total*: ${localMoney(
			body.OrderPayments?.length
				? body?.OrderPayments[0].price
				: "Não definido.",
		)}`,
		` `,
	];

	return a.filter((e) => e).join("\n");
};

export function addPhoneMask(phoneNumber?: string) {
	if (!phoneNumber) return null;
	// Remove all non-numeric characters from the input string
	let numericOnly = phoneNumber?.replace(/\D/g, "");

	if (numericOnly.slice(0, 2) === "55" && numericOnly.length === 13) {
		numericOnly = numericOnly.slice(2);
		return `(${numericOnly.slice(0, 2)}) ${numericOnly.slice(
			2,
			7,
		)}-${numericOnly.slice(7)}`;
	}

	if (numericOnly.slice(0, 2) === "55" && numericOnly.length === 12) {
		numericOnly = numericOnly.slice(2);
		return `(${numericOnly.slice(0, 2)}) ${numericOnly.slice(
			2,
			7,
		)}-${numericOnly.slice(7)}`;
	}

	// Check if the phone number is valid
	if (numericOnly.length === 11) {
		return `(${numericOnly.slice(0, 2)}) ${numericOnly.slice(
			2,
			7,
		)}-${numericOnly.slice(7)}`;
	} else if (numericOnly.length === 10) {
		return `(${numericOnly.slice(0, 2)}) ${numericOnly.slice(
			2,
			6,
		)}-${numericOnly.slice(6)}`;
	} else {
		return numericOnly; // Return the original input if it doesn't match expected lengths
	}
}

export const formatWhatsappNumberToRemoveCountryCode = (number: string) => {
	if (number.slice(0, 2) === "55" && number.length === 13) {
		number = number.slice(2);
		return `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`;
	}

	if (number.slice(0, 2) === "55" && number.length === 12) {
		number = number.slice(2);
		return `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`;
	}
};

export function isOrderDateToday(
	order: { created_at?: Date | undefined } | null,
) {
	const timezone = -3;
	console.log(order?.created_at);

	return (
		dayjs(order?.created_at)
			.utc()
			.add(timezone)
			.startOf("day")
			.format("DD/MM/YYYY") ===
		dayjs().utc().add(timezone).startOf("day").format("DD/MM/YYYY")
	);
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = DEFAULT_REDIRECT,
) {
	if (!to || typeof to !== "string") {
		return defaultRedirect;
	}

	if (!to.startsWith("/") || to.startsWith("//")) {
		return defaultRedirect;
	}

	return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
	id: string,
): Record<string, unknown> | undefined {
	const matchingRoutes = useMatches();
	const route = useMemo(
		() => matchingRoutes.find((route) => route.id === id),
		[matchingRoutes, id],
	);
	return route?.data as Record<string, unknown> | undefined;
}

export function getRandomBrightColor() {
	// Generate random RGB values
	var r = Math.floor(Math.random() * (256 - 170 + 1)) + 170; // Red (0-255)
	var g = Math.floor(Math.random() * (256 - 170 + 1)) + 170; // Green (0-255)
	var b = Math.floor(Math.random() * (256 - 170 + 1)) + 170; // Blue (0-255)

	// Convert RGB to hexadecimal
	var hex = ((r << 16) | (g << 8) | b).toString(16);

	// Pad the hex value if necessary
	while (hex.length < 6) {
		hex = "0" + hex;
	}

	return "#" + hex;
}

function isUser(
	user: any,
): user is User & { business_type: CompanyBusinessTypes } {
	return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): CookieParams {
	const data = useMatchesData("root");
	return data?.user as any;
}

// export function useUser(): User {
//   const maybeUser = useOptionalUser();
//   if (!maybeUser) {
//     throw new Error(
//       "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
//     );
//   }
//   return maybeUser;
// }

export function validateEmail(email: unknown): email is string {
	return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export const appFilePaths = {
	appIconImage: "https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg",
};

export const presetValues = (user: any) => ({
	company_id: user?.company_id as string,
	company_base_id: user?.company_base_id as string,
});

export const presetValuesAnotherWay = (user: any) => ({
	company_id: user?.company_id as string,
	company_base_id: user?.company_base_id as string,
});

// prettier-ignore
export const composePagination = (
	query: { page: string; offset: string },
	{ totalRecords }: { totalRecords: number },
	DEFAULT_PER_PAGE = 9,
) => {
	let page: any = "last";
	if (query.page != "last") page = parseInt(query.page) || 1;
	const offset = parseInt(query.offset) || DEFAULT_PER_PAGE;
	const lastPage = Math.ceil(totalRecords / offset);
	let skip = page == "last" ? (lastPage - 1) * offset : (page - 1) * offset;

	if (skip < 0) skip = 0;

	return {
		take: offset,
		skip,
		currentPage: page == "last" ? lastPage : page,
		totalPages: Math.ceil(totalRecords / offset),
		totalRecords,
		offset,
	};
};

export function removePhone9Digit(number: string) {
	if (number.slice(0, 2) == "55" && number[4] === "9") {
		console.log(number.slice(0, 4));
		console.log(number.slice(5));
		return number.slice(0, 4) + number.slice(5);
	}
	return number;
}

export const isNumericAndPositive = (content: string) =>
	/^([1-9]\d*|0)(\.\d+)?$/.test(content);

export const serializeAddress = (client: any) => {
	return `${client?.Street?.name || ""} ${
		client?.number ? ", " + client?.number : ""
	}${client?.block ? ", " + client?.block : ""}${
		client?.Street?.Neighborhood?.name
			? ", " + client?.Street?.Neighborhood?.name
			: ""
	}`;
};

export const serializeAddressNoNeighborhood = (client: any) => {
	return `${client?.Street?.name || ""} ${
		client?.number ? ", " + client?.number : ""
	}${client?.block ? ", " + client?.block : ""}`;
};

const nextStatusList = {
	NONE: "TRANSIT",
	TRANSIT: "SENT",
	SENT: "NONE",
};

export const labelForOrderStatus = {
	NONE: "Ainda não enviado",
	TRANSIT: "Enviado",
	SENT: "Entregue",
};

export const getNextOrderStatus = (status: "NONE" | "SENT" | "TRANSIT") => {
	// console.log("status actual", status, "next", nextStatusList[status]);
	return nextStatusList[status];
};
export const getPrevOrderStatus = (status: "NONE" | "SENT" | "TRANSIT") =>
	status === "SENT" ? "TRANSIT" : status === "TRANSIT" ? "NONE" : "SENT";
export const dayjs = _dayjs;

const textsMap = new Map([
	[
		"CAR_WASH",
		{
			"Valor de venda": "Valor do serviço (Para o cliente)",
			"Valor de compra": "Gasto para realizar o serviço (Para o dono)",
		},
	],
]);

type availableTextsType = "Valor de venda" | "Valor de compra";

export const getText = (businessType: string, text: availableTextsType) => {
	return textsMap.get(businessType)?.[text] || text;
};

export function flatifyArray(array: any[]) {
	if (!array.every((e) => Array.isArray(e))) return array;
	return array.reduce((acc, next) => acc?.concat(Object?.values(next)), []);
}

export const getPaymentMethod = (paymentMethod: string) => {
	return paymentMethod === "MONEY"
		? "À vista"
		: paymentMethod === "TRANSFER"
		  ? "Transferência"
		  : paymentMethod === "CARD"
			  ? "Cartão"
			  : paymentMethod === "PIX"
				  ? "PIX"
				  : paymentMethod === "BOLETO"
					  ? "BOLETO"
					  : paymentMethod === "TO_RECEIVE"
						  ? "À PRAZO"
						  : paymentMethod === "TICKET"
							  ? "Vale gás"
							  : "Não identificado";
};

export const sortByCreatedAt = (data: any, asc = true) =>
	data?.sort(
		(a: any, b: any) =>
			new Date(a.created_at).getTime() -
			(asc
				? new Date(b.created_at).getTime()
				: -new Date(b.created_at).getTime()),
	);

export const months = [
	{ value: "01", text: "Janeiro" },
	{ value: "02", text: "Fevereiro" },
	{ value: "03", text: "Março" },
	{ value: "04", text: "Abril" },
	{ value: "05", text: "Maio" },
	{ value: "06", text: "Junho" },
	{ value: "07", text: "Julho" },
	{ value: "08", text: "Agosto" },
	{ value: "09", text: "Setembro" },
	{ value: "10", text: "Outubro" },
	{ value: "11", text: "Novembro" },
	{ value: "12", text: "Dezembro" },
];

const currentYear = parseInt(dayjs().format("YYYY"));

export const years = Array.from(Array(100).keys())
	.map((e) => currentYear - e)
	.map((e) => ({ value: e.toString(), text: e.toString() }));

export const sortOrders = (orders: any, newOrder?: any) => {	
	if (newOrder) {
		orders = [...orders.filter((e: any) => e.id !== newOrder.id), newOrder];
	}

	let ordersByDeliverymans = orders
		?.filter((order: any) => order.is_delivery)
		.reduce((acc: any, order: any) => {
			if (!acc[order?.deliveryman_id]) acc[order?.deliveryman_id] = [];
			acc[order?.deliveryman_id].push(order);
			return acc;
		}, {});

	let ordersSorted = Object.values(ordersByDeliverymans).reduce(
		(acc: any, ordersByDeliveryman: any) => {
			return [
				...acc,
				...ordersByDeliveryman.sort(
					(a: any, b: any) =>
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
				),
			];
		},
		[],
	) as any;

	// Get default deliveryman
	const firstRows = ordersSorted.filter(
		(e: any) => e.Deliveryman?.color === "#ed3939",
	);
	const restRows = ordersSorted.filter(
		(e: any) => e.Deliveryman?.color !== "#ed3939",
	);

	// ordersSorted = [...firstRows, ...restRows]
	ordersSorted = ordersSorted.sort((x:any,y:any)=>x.Deliveryman?.created_at <  y.Deliveryman?.created_at ? -1 : 1)

	return [
		...orders
			.filter((order: any) => !order.is_delivery)
			.sort(
				(a: any, b: any) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			),
		...ordersSorted,
	];
};

export const getGroupNamePrinter = (params: {
	company_id: string;
	company_base_id: string;
}) => `group_${params?.company_id}_${params?.company_base_id}`;

export const INPLACE_COLOR = "#fafacf";

export type AvailableRedisKeys =
	| "company-settings"
	| "orders"
	| "daily-metrics"
	| "ticket-partners"
	| "daily-reports"
	| "lateral-bar-daily-reports"
	| "monthly-reports"
	| "moneyflow-categories"
	| 'unpaid-orders'
	| "monthly-money-flow";

export const getRedisKey = (
	key: AvailableRedisKeys,
	user: any,
	date?: string,
) =>
	`${key}-${user.company_base_id || presetValues(user).company_base_id}${
		date ? "-" + date : ""
	}`;

const logsRedisEnabled = false;

export const getCachedData = async (
	key: AvailableRedisKeys,
	user: any,
	redisClient: Redis,
	date?: string,
) => {
	if (!redisClient) return;
	// return null
	try {
		// measure time
		const start = Date.now();
		const result = JSON.parse(
			(await redisClient.get(getRedisKey(key, user, date))) as string,
		);
		logsRedisEnabled &&
			console.log("✅ Returning cached data", {
				key: getRedisKey(key, user, date),
				timeElapsed: `${Date.now() - start} ms`,
			});
		return result;
	} catch (e) {
		logsRedisEnabled &&
			console.log(
				`❌ Error to get orders in cache using key: ${getRedisKey(key, user)}`,
				presetValues(user),
			);
	}
};

export const setCachedData = async (
	key: AvailableRedisKeys,
	user: any,
	redisClient: Redis,
	value: any,
	date?: string,
) => {
	if (!redisClient) return;

	let redisKey;
	try {
		const start = Date.now();
		redisKey = getRedisKey(key, user, date);
		await redisClient.set(redisKey, JSON.stringify(value));
		logsRedisEnabled &&
			console.log(
				`✅ Key ${redisKey} set successfully | timeElapsed: ${
					Date.now() - start
				} ms`,
				presetValues(user),
			);
	} catch (e) {
		logsRedisEnabled && console.log(`❌ Error to set key`, e, redisKey);
	}
};

export const delCachedData = async (
	key: AvailableRedisKeys,
	user: any,
	redisClient: Redis,
	date?: string | Date,
) => {
	if (!redisClient) return;

	if(typeof date === 'object') {
		date = dayjs(date).format("YYYY-MM-DD");
	}

	let redisKey;
	try {
		redisKey = getRedisKey(key, user, date);
		const start = Date.now();
		await redisClient.del(redisKey);
		logsRedisEnabled &&
			console.log(
				`✅ 🗑️ Key deleted | timeElapsed: ${Date.now() - start} ms`,
				redisKey,
			);
	} catch (e) {
		logsRedisEnabled && console.log(`❌ Error deleting`, e, redisKey);
	}
};

export const getMonthlyReportsKey = (props: { year: string; month: string }) =>
	`${props.year}-${props.month}`;

// Reset all cached data for this specific date if that is a change evolving order
export const delCachedDataOrderRelated = async (
	key: AvailableRedisKeys,
	user: any,
	redisClient: Redis,
	date?: string,
) => {
	await Promise.all([
		delCachedData("orders", user, redisClient, date),
		delCachedData("daily-metrics", user, redisClient, date), // Order specific date 
		delCachedData("daily-metrics", user, redisClient, dayjs().format("YYYY-MM-DD")), // Current date, as when we pay a order we need to refresh the curernt day money flow
		delCachedData("daily-reports", user, redisClient, date),
		delCachedData("daily-reports", user, redisClient, dayjs().format("YYYY-MM-DD")),
		delCachedData("unpaid-orders", user, redisClient), // Is not date specific
		delCachedData("lateral-bar-daily-reports", user, redisClient, date),
		// TODO: BUG: When a previous month order is updated the monthly report is not updated, becauuse the cache is not deleted.
		delCachedData(
			"monthly-reports",
			user,
			redisClient,
			getMonthlyReportsKey({
				year: dayjs(date).format("YYYY"),
				month: dayjs(date).format("MM"),
			}),
		),
	]);
};

export const getUserWithNewCompanyBaseId = (
	user: any,
	newCompanyBaseId: string,
): CookieParams => {
	return {
		...user,
		company_base_id: newCompanyBaseId,
	};
};
