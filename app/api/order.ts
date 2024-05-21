import { DailyMetricsType } from "@/routes/api.list/getDailyMetrics";
import { getOrderType } from "@/routes/api.list/getOrder";
import { DailyReportsType } from "@/routes/api.list/getReports";
import { OrderStatus } from "@prisma/client";
import axios from "axios";

export async function createOrder(data: any) {
  const result = (await axios.post("/api/action?table=order:create", data)) as {
    data: any;
  };
  return result.data as any;
}

export async function updateOrder(data: any) {
  const result = (await axios.post("/api/action?table=order:update", data)) as {
    data: any;
  };
  return result.data as any;
}

export async function deleteOrders(ids: string[]) {
  const result = (await axios.post(
    `/api/action?table=order:delete`
  ,{ ids }));
  return result.data as any;
}

export async function updateOrdersPaid(ids: string[]) {
  const result = (await axios.post(
    `/api/action?table=orders:pay`
  ,{ ids }));
  return result.data as any;
}

export async function updateOrdersStatus(ids: string[], nextStatus: OrderStatus) {
  const result = (await axios.post(
    `/api/action?table=orders:status`
  ,{ ids, nextStatus }));
  return result.data as any;
}

export async function updateOrdersDeliveryman(ids: string[], deliveryman_id: string) {
  const result = (await axios.post(
    `/api/action?table=orders:deliveryman_id`
  ,{ ids, deliveryman_id }));
  return result.data as any;
}

export async function getDailyOrdersAndInfos(date: string) {
  return axios.get(`/api/list?table=daily-metrics-and-orders&date=${date}`);
}

export async function getOrder(filter: { order_payment_id: string }) {
  const result = (await axios.get(`/api/list?table=get:order&order_payment_id=${filter.order_payment_id}`)) as {
    data: any;
  };
  return result.data.order as getOrderType;
}


export async function getReports(date?: string | Date | null) {
  if(date instanceof Date) {
    date =  date.toISOString().split('T')[0];
  }
  
  const result = (await axios.get(`/api/list?table=reports&date=${date}`)) as {
    data: DailyReportsType;
  };
  return result.data;
}

export async function updateOrderCompanyBase(order_id: string, new_company_base_id?: string) {
  const result = await axios.post(`/api/action?table=order:update-company-base`, {
    order_id: order_id
  })

  return result
}