import { deliverymanType } from "@/routes/api.list/getDeliverymans";
import axios from "axios";

export async function searchDeliverymans() {
	const result = (await axios.get("/api/list?table=deliverymans")) as {
		data: deliverymanType[];
	};
	return result.data as deliverymanType[];
}
