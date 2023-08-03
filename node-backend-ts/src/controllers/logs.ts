import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate, dbCount } from "../utils";

import { logs } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";


export const get = async (req: Request, res: Response) => {

    let query: any = { client: req.params.id };

    const allLogs = await dbGet(logs, query, false, null, null, null, { createdAt: -1 }, 10, null, null, true);

    return sendResponce(res, allLogs);
}
