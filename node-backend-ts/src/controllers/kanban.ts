import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate } from "../utils";

import { kanbans, clients, tasks, logs, sequences } from "../models";

import { sendResponce } from "../utils";

export const get = async (req: Request, res: Response) => {

    let query: any = {};
    const id = req.params.id;

    if (id) {
        query = {
            _id: id,
        };
    }

    const kanbanData = await dbGet(kanbans, query, false, null, 'tasks.taskId tasks.client tasks.assignedTo', 'firstName lastName email image code title description type dueDate status completed archive', null, null, null, null, true);

    return sendResponce(res, kanbanData);
}

export const reArrangeKanban = async (req: Request, res: Response) => {

    let query: any = {};
    let body = req.body;
    let response: any;
    let newTask: any;
    let addNewtask = false;

    if (body.statusChange) {

        const newCloumn: any = await dbGet(kanbans, { _id: body.column }, true, '_id title', null, null, null, null, null, null, true);

        if (newCloumn.title === 'Completed') {
            // const onboardingTask: any = await dbGet(tasks, { _id: body.task, type: 'onboarding', completed: false }, true, '_id client assignedTo', null, null, null, null, null, null, true);

            // if (onboardingTask && onboardingTask._id) {

            //     await dbUpdate(clients, { _id: onboardingTask.client }, { 'onboarding.callDone': true });

            //     // Create Post Call Task
            //     response = await Promise.all([
            //         // Get Task Number
            //         sequences.increment({ _id: 'task' }),
            //         // Get Kanban Status
            //         dbGet(kanbans, { title: 'Pending' }, true, '_id title', null, null, null, null, null, null, true)
            //     ]);

            //     let taskData = {
            //         code: response[0],
            //         type: 'postcall',
            //         title: 'Post Onboarding Feedback',
            //         description: 'You can send feedback from client dashboard screen.',
            //         client: onboardingTask.client,
            //         assignedTo: onboardingTask.assignedTo,
            //         status: {
            //             statusId: response[1]._id,
            //             title: response[1].title,
            //         }
            //     };

            //     newTask = await dbSave(tasks, taskData);
            //     addNewtask = true;
            // }
        }

        await Promise.all([
            dbUpdate(kanbans, { _id: body.column }, { tasks: body.tasks }),
            dbUpdate(kanbans, { _id: body.polumn }, { tasks: body.ptasks }),
            dbUpdate(tasks, { _id: body.task }, {
                status: {
                    title: newCloumn.title,
                    statusId: newCloumn._id,
                },
                completed: (newCloumn.title === 'Completed') ? true : false,
            }),
            dbSave(logs, {
                module: 'task', action: 'status-changed', entityId: body.task, createdBy: req.currentUser.id, data: {
                    taskId: body.task,
                    status: { title: newCloumn.title, statusId: newCloumn._id }
                }
            })
        ]);

        // if (addNewtask) {
        //     await dbUpdate(kanbans, { _id: response[1]._id.toString() }, {
        //         $push: {
        //             tasks: {
        //                 $each: [{
        //                     taskId: newTask._id,
        //                     client: newTask.client,
        //                     assignedTo: newTask.assignedTo
        //                 }],
        //                 $position: 0
        //             }
        //         }
        //     });
        // }

    } else {
        await dbUpdate(kanbans, { _id: body.column }, { tasks: body.tasks });
    }

    const kanbanData = await dbGet(kanbans, query, false, null, 'tasks.taskId tasks.client tasks.assignedTo', 'firstName lastName email image code title description type dueDate status completed archive', null, null, null, null, true);

    return sendResponce(res, kanbanData);
}
