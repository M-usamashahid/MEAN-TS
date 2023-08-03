import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate } from "../utils";

import { tasks, clients, users, kanbans, sequences, logs } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";

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

    const allTasks = await dbGet(tasks, query, isSingle, 'code title description dueDate status completed archive', 'client assignedTo', 'firstName lastName email image', null, null, null, null, true);

    return sendResponce(res, allTasks);
}

export const create = async (req: Request, res: Response) => {

    let body = req.body;

    body.code = await sequences.increment({ _id: 'task' });

    if (body.status && body.status.title === 'Completed') {
        body.completed = true;
    }

    const newTask: any = await dbSave(tasks, { ...body });

    await dbUpdate(kanbans, { _id: body.status.statusId }, {
        $push: {
            tasks: {
                $each: [{
                    taskId: newTask._id,
                    client: body.client,
                    assignedTo: body.assignedTo
                }],
                $position: 0
            }
        }
    });

    dbSave(logs, { module: 'task', action: 'created', client: body.client, entityId: newTask._id, createdBy: req.currentUser.id, data: newTask });

    return sendResponce(res, newTask);
}

export const update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;

    let query = { _id: id };
    let getTask: any = await dbGet(tasks, query, true, "_id");

    if (getTask) {
        await dbUpdate(
            tasks,
            query,
            {
                ...body
            }
        );

        dbSave(logs, { module: 'task', action: 'updated', entityId: id, updatedBy: req.currentUser.id, data: body });

        return sendResponce(res, true);
    } else {
        throw new NotFoundError();
    }

}

export const helper = async (req: Request, res: Response) => {

    const response = await Promise.all([
        dbGet(clients, {}, false, 'firstName lastName email', null, null, { createdAt: -1 }, null, null, null, true),
        dbGet(users, { role: { $in: ['headcoach', 'coach'] } }, false, 'firstName lastName email', null, null, { createdAt: -1 }, null, null, null, true),
        dbGet(kanbans, {}, false, 'title', null, null, { order: 1 }, null, null, null, true),
    ]);

    return sendResponce(res, {
        clients: response[0],
        users: response[1],
        kanbans: response[2],
    });
}

export const calls = async (req: Request, res: Response) => {

    const callTasks: any = await dbGet(tasks, {
        client: req.currentUser.id,
        type: 'call',
        completed: false,
        'status.title': {
            $in: ['Pending', 'In Progress']
        }
    }, false, '_id eventURI cancelURI rescheduleURI dueDate', null, null, null, null, null, null, true);
    sendResponce(res, {
        calls: callTasks
    });
}