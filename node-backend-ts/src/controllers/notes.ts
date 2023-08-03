import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate, dbCount } from "../utils";
import { sendHTMLEmail } from "../services";

import { notes, clients, logs } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";

export const clientNotesGet = async (req: Request, res: Response) => {

    let query: any = {
        client: req.params.client
    };

    const allClientNotes = await dbGet(notes, query, false, null, null, null, { createdAt: -1 }, null, null, null, true);

    return sendResponce(res, allClientNotes);
}

export const create = async (req: Request, res: Response) => {
    const { title, client, description, sent } = req.body;

    const newNote: any = await dbSave(notes, {
        title,
        client,
        description,
        createdBy: req.currentUser._id
    });

    dbSave(logs, { module: 'notes', action: 'created', entityId: newNote._id, client: client, data: newNote });


    if (sent) {

        const exist: any = await dbGet(clients, { _id: client }, true, '_id email', null, null, null, null, null, null, true);

        const emailSent = await sendHTMLEmail(exist.email, title, description);

        dbSave(logs, { module: 'notes', action: 'sent', entityId: newNote._id, client: client, data: emailSent });

    }

    sendResponce(res, newNote);
}

export const update = async (req: Request, res: Response) => {
    const { title, description, sent } = req.body;

    const id = req.params.id;

    const isExist: any = await dbGet(notes, { _id: id }, true, null, null, null, null, null, null, null, true);

    if (isExist) {

        await dbUpdate(
            notes,
            { _id: id },
            {
                title,
                description,
                updatedBy: req.currentUser._id
            }
        );

        dbSave(logs, {
            module: 'notes', action: 'updated', entityId: id, client: isExist.client, data: {
                title,
                description,
                updatedBy: req.currentUser._id
            }
        });


        if (sent) {

            const exist: any = await dbGet(clients, { _id: isExist.client }, true, '_id email', null, null, null, null, null, null, true);

            const emailSent = await sendHTMLEmail(exist.email, title, description);

            dbSave(logs, { module: 'notes', action: 'sent', entityId: id, client: isExist.client, data: emailSent });
        }

        return sendResponce(res, true);

    } else {
        throw new NotFoundError();
    }

}