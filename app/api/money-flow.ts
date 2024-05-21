import axios from "axios";

export async function createMoneyFlow(data: any) {
  const result = (await axios.post("/api/action?table=moneyflow:create", data)) as {
    data: any;
  };
  return result.data as any;
}

export async function deleteMoneyFlow(data: any) {
  const result = (await axios.post("/api/action?table=moneyflow:delete", data)) as {
    data: any;
  };
  return result.data as any;
}
