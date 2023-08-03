import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate, dbCount } from "../utils";

import { programs } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";

export const create = async (req: Request, res: Response) => {
    const { title } = req.body;

    const isExist: any = await dbGet(programs, { title }, true, null, null, null, null, null, null, 'all', true);

    if (isExist && !isExist.isDeleted) {
        throw new NotAuthorizedError("Program already exists");
    } else if (isExist && isExist.isDeleted) {
        throw new NotAuthorizedError("Program was deleted.");
    } else {

        const newUser: any = await dbSave(programs, {
            title,
            createdBy: req.currentUser._id
        })

        sendResponce(res, newUser);
    }
}

export const get = async (req: Request, res: Response) => {

    let query: any = {};
    let isSingle = false;
    const id = req.params.id;

    if (id) {
        query = {
            _id: id,
        };
        isSingle = true;
    }

    const allUsers = await dbGet(programs, query, isSingle, null, null, null, null, null, null, null, true);

    return sendResponce(res, allUsers);
}

export const update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;

    const isExist: any = await dbGet(programs, { _id: id }, true, null, null, null, null, null, null, null, true);

    if (isExist) {

        delete body.createdAt
        delete body.createdBy
        delete body.accounts

        await dbUpdate(
            programs,
            { _id: id },
            {
                $set: {
                    ...body,
                    updatedBy: req.currentUser._id
                }
            }
        );

        return sendResponce(res, true);
    } else {
        throw new NotFoundError();
    }
}

export const listing = async (req: Request, res: Response) => {

    const body = req.body;

    let query: any = {
    };
    let select = 'title createdAt';
    let limit = 0;
    let skip = 0;
    let search = '';

    if (body.limit !== 0) {
        limit = body.limit;
    }

    if (body.skip !== 0) {
        skip = body.skip;
    }

    if (body.search) {
        search = body.search.toLowerCase();
        search = search.trim();
        search = search.replace(/\s/g, '.*');
        search = '.*' + search + '.*';

        query.title = { $regex: search };
    }

    const response = await Promise.all([
        dbCount(programs, query),
        dbGet(programs, query, false, select, null, null, { createdAt: -1 }, limit, skip)
    ]);

    return sendResponce(res, {
        count: response[0],
        data: response[1],
    });

}