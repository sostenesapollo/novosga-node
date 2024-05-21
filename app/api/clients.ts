import { ClientReturnType } from "@/routes/api.list/getCompanyClients";
import axios from "axios";

export const searchClient = async (text: string) => {
	const result = await axios.get(`/api/list?table=clients&query=${text}`);
	return result.data.clients as ClientReturnType;
};

export const getClientInfosById = async (id: string) => {
	const result = await axios.get(`/api/list?table=client&id=${id}`);
	return result.data.client as ClientReturnType;
};

export async function createClient(data: any) {
	const result = (await axios.post("/api/action?table=client:create", data)) as {
	  data: any;
	};
	return result.data as any;
}

export async function updateClient(data: any) {
	const result = (await axios.post("/api/action?table=client:update", data)) as {
	  data: any;
	};
	return result.data as any;
}