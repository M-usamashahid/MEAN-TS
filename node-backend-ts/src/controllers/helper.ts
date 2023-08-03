import { Request, Response } from "express";
import { dbGet, } from "../utils";

import { clients, orders, products } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";

export const get = async (req: Request, res: Response) => {

    let query: any = { _id: req.params.orderid };

    const response: any = await Promise.all([
        dbGet(orders, query, true, null, null, null, null, null, null, null, true),
        dbGet(products, {}, true, null, null, null, null, null, null, null, true),
    ]);

    return sendResponce(res, {
        order: response[0],
        products: response[1],
    });
}
