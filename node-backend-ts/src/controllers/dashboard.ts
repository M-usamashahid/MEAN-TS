
import { Request, Response } from "express";
import { dbCount } from "../utils";
import { clients, orders, bookings } from "../models";

import { sendResponce } from "../utils";

export const get = async (req: Request, res: Response) => {

    const response: any = await Promise.all([
        dbCount(bookings, { isDeleted: false }),
        dbCount(orders, { completed: true }),
        dbCount(orders, { completed: false }),
        dbCount(clients, { isDeleted: false }),
    ]);

    return sendResponce(res, {
        bookings: response[0],
        paidOrders: response[1],
        unpaidOrders: response[2],
        clients: response[3],
    });
}