import axios from "axios";
import { getOrderMessageBodyDeliveryman, getOrderMessageBodyDeliverymanPaidOrders, sendWhatsappTextMessage } from "@/lib/utils/utils";

export const validateWhatsappClient = async (whatsappClient: string, whatsappApiUrl: string) => {
    console.log('validate', whatsappClient, whatsappApiUrl);
    
    const result = await axios.get(`${whatsappApiUrl}/client/${whatsappClient}`, {});
    return result
}

export const sendMessageToDeliverymanInWhatsapp = async ( order: any, companyRoute = "", whatsappApiUrl = "") => {
    const phone = order.Deliveryman?.whatsapp;

    if (phone === undefined || phone === null) {
        throw new Error(`Entregador ${order.Deliveryman?.name} não possui whatsapp cadastrado.`)
    }
    if (!companyRoute) {
        throw new Error(`Contacte o adminstrador para configurar o [companyRoute] da sua empresa.`)
    }

    try {
        await validateWhatsappClient(companyRoute, whatsappApiUrl);
    } catch (e) {
        throw new Error(`Necessário cadastrar um client whatsapp na api para sua empresa.`);
    }

    await sendWhatsappTextMessage(
        phone,
        getOrderMessageBodyDeliveryman(order),
        companyRoute,
        whatsappApiUrl
    );
};

export const sendMessageToDeliverymanInWhatsappPaidOrder = async ( order: any, companyRoute = "", whatsappApiUrl = "") => {
    const phone = order.Deliveryman?.whatsapp;

    if (phone === undefined || phone === null) {
        throw new Error(`Entregador ${order.Deliveryman?.name} não possui whatsapp cadastrado.`)
    }
    if (!companyRoute) {
        throw new Error(`Contacte o adminstrador para configurar o [companyRoute] da sua empresa.`)
    }

    try {
        await validateWhatsappClient(companyRoute, whatsappApiUrl);
    } catch (e) {
        throw new Error(`Necessário cadastrar um client whatsapp na api para sua empresa.`);
    }

    await sendWhatsappTextMessage(
        phone,
        getOrderMessageBodyDeliverymanPaidOrders(order),
        companyRoute,
        whatsappApiUrl
    );
};