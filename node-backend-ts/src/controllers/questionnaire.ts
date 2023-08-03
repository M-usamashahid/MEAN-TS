import { Request, Response } from "express";
import { dbGet, dbUpdate, dbSave, generateClientAuthToken } from "../utils";

import { clients, sequences, kanbans, tasks } from "../models";

import { NotFoundError } from "../errors";
import { sendResponce } from "../utils";

export const update = async (req: Request, res: Response) => {
    const { questionnaire } = req.body;

    let query = { _id: req.currentUser.id };
    let getClient: any = await dbGet(clients, query, true, "_id questionnaire firstName lastName email onboarding", 'onboarding.coach', '_id firstName lastName email', null, null, null, null, true);

    if (getClient) {

        await dbUpdate(
            clients,
            query,
            {
                questionnaire,
                updatedBy: req.currentUser._id
            }
        );

        if (questionnaire.filled) {
            // create Questionnaire Review Task
            const response: any = await Promise.all([
                // Get Task Number
                sequences.increment({ _id: 'task' }),
                // Get Kanban Status
                dbGet(kanbans, { title: 'Pending' }, true, '_id title', null, null, null, null, null, null, true)
            ]);

            let taskData = {
                code: response[0],
                type: 'questionnaire',
                title: 'Questionnaire Review',
                description: 'You can review questionnaire from client dashboard screen.',
                client: req.currentUser.id,
                assignedTo: getClient.onboarding.coach._id,
                status: {
                    statusId: response[1]._id,
                    title: response[1].title,
                }
            }

            const newTask: any = await dbSave(tasks, taskData);
            dbUpdate(kanbans, { _id: response[1]._id }, {
                $push: {
                    tasks: {
                        $each: [{
                            taskId: newTask._id,
                            client: req.currentUser.id,
                            assignedTo: getClient.onboarding.coach._id,
                        }],
                        $position: 0
                    }
                }
            });
        }

        getClient = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);

        const jwt = await generateClientAuthToken(getClient);

        req.session = { jwt };

        sendResponce(res, { jwt });

    } else {
        throw new NotFoundError();
    }
}

export const get = async (req: Request, res: Response) => {

    let query = { _id: req.currentUser.id };
    let getClient: any = await dbGet(clients, query, true, "_id questionnaire");

    return sendResponce(res, getClient);
}