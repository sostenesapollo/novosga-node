import { user } from "@/components/orders/orders-table";
import { localMoney } from "@/lib/utils/currency";
import { paymentMethodsAvailable } from "@/lib/utils/payment-methods";
import dayjs from "dayjs";

export const printOrders = (
    orders: any,
    socket: any,
) => {
    const rows = [];
  
    console.log("Print", { orders });
  
    try {
      for (const order of orders) {
        let text = "";
  
        const neighborhood = capitalizeWords(
          order?.Client?.Street?.Neighborhood?.name
        );
  
        text += `${order?.Client?.name || "Cliente não informado"}\n`;
        rows.push({
          text: order?.Client?.name || "Cliente não informado",
          css: {
            "text-align": "left",
            "font-size": "14px",
            "font-family": "Calibri",
            fontWeight: "900",
          },
        });
  
        if (order?.Client) {
          const address = getCompleteAddress(order);
          text += `${address}\n`;
          rows.push({
            text: address,
            css: {
              "text-align": "left",
              "font-size": "14px",
              "font-family": "Calibri",
              fontWeight: "800",
            },
          });
        }
  
        if (order?.Client && order?.Client?.neighborhood?.trim() !== "") {
          text += `${neighborhood}\n`;
          rows.push({
            text: neighborhood,
            css: {
              "text-align": "left",
              "font-size": "15px",
              "font-family": "Calibri",
              fontWeight: "900",
            },
          });
        }
  
        if (order?.Client && order?.Client?.reference?.trim() !== "") {
          text += `${order.Client.reference}\n`;
          rows.push({
            text: order.Client.reference,
            css: {
              "text-align": "left",
              "font-size": "12px",
              "font-family": "Calibri",
              fontWeight: "600",
            },
          });
        }
  
        if (order?.Client?.phone) {
          text += `${order?.Client?.phone}\n`;
          rows.push({
            text: order?.Client?.phone,
            css: {
              "text-align": "left",
              "font-size": "14px",
              "font-family": "Calibri",
              fontWeight: "500",
            },
          });
        }
  
        if (order?.Client?.phone2) {
          text += `${order?.Client?.phone2}\n`;
          rows.push({
            text: order?.Client?.phone2,
            css: {
              "text-align": "left",
              "font-size": "14px",
              "font-family": "Calibri",
              fontWeight: "500",
            },
          });
        }
  
        text += `Produtos\n`;
        rows.push({
          text: `Produtos`,
          css: {
            "text-align": "left",
            "font-size": "11px",
            "font-family": "Calibri",
            fontWeight: "800",
            "text-decoration": "underline",
          },
        });
  
        order?.OrderProducts?.forEach((val: any) => {
          console.log(val);
          const product = `${val.quantity} x ${val.Product.name}`;
          text += `${product}\n`;
  
          rows.push({
            text: product,
            css: {
              "text-align": "left",
              "font-size": "14px",
              "font-family": "Calibri",
              fontWeight: "500",
            },
          });
        });
  
        text += `Pagamento\n`;
        rows.push({
          text: `Pagamento`,
          css: {
            "text-align": "left",
            "font-size": "11px",
            "font-family": "Calibri",
            fontWeight: "800",
            "text-decoration": "underline",
          },
        });
  
        order?.OrderPayments?.forEach((val: any) => {
          text += `${localMoney(val.price)} - ${
            paymentMethodsAvailable[val.method]
          }\n`;
  
          rows.push({
            text: `${localMoney(val.price)} - ${
              paymentMethodsAvailable[val.method]
            }`,
            css: {
              "text-align": "left",
              "font-size": "14px",
              "font-family": "Calibri",
              fontWeight: "500",
            },
          });
        });
  
        rows.push({
          text: `${dayjs(order?.created_at).format("DD/MM/YYYY - HH:mm")}`,
          css: {
            "text-align": "left",
            "font-size": "14px",
            "font-family": "Calibri",
            fontWeight: "500",
          },
        });
  
        rows.push({
          text: `-----------`,
          css: {
            "text-align": "left",
            "font-size": "14px",
            "font-family": "Calibri",
            fontWeight: "500",
          },
        });
      }
      
      console.log('data:', { rows, order: user.value });
      
      // order is just to get the company_id and company_base_id
      socket?.emit("print", { rows, order: user.value });
    } catch (e: any) {
      console.log("erro ao imprimir", e);
    }
  };

  export function capitalizeWords(sentence: string) {
    return sentence?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
  }


export const getCompleteAddress = (order: any) => {
    const street = capitalizeWords(order?.Client?.Street?.name);
    const block = capitalizeWords(order?.Client?.block);
    const number = capitalizeWords(order?.Client?.number);
  
    let _addr = "";
    if (street && street?.trim() !== "") {
      _addr += street;
    }
  
    if (block) {
      if (_addr?.trim() !== "" && block?.trim() !== "") {
        _addr += `, ${block}`;
      }
    }
  
    if (_addr?.trim() !== "" && number && number?.trim() !== "") {
      _addr += `, ${number}`;
    }
  
    return _addr;
  };