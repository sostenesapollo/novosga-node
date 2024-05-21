import dayjs from "dayjs";

type isOrderTodaypropsTypes = {
    order: {created_at: Date};
    user: {timezone: number};
}

export function isOrderToday({order, user}: isOrderTodaypropsTypes) {
    const startOfDayInCompanyBase_OrderDate = dayjs(order?.created_at).utc().add(user.timezone, 'hour')
    const startOfDayInCompanyBase_Today = dayjs().utc().add(user.timezone, 'hour').startOf('day');
    return startOfDayInCompanyBase_OrderDate.format('YYYY-MM-DD') === startOfDayInCompanyBase_Today.format('YYYY-MM-DD');
}