
import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate, dbCount } from "../utils";
import { tasks, clients, kanbans, sequences, logs, schedule, orders, bookings } from "../models";

import { GenericServerError } from "../errors";

import { webhooksConstructEvent } from "../services";

import { sendResponce } from "../utils";
const axios = require("axios").default;

export const calendelyWebHookAPI = async (req: Request, res: Response) => {

    console.log('================ Calendely Web Hook API =====================');

    const body = req.body;
    const payload = req.body.payload;

    console.log(payload);

    if (body.event === 'invitee.created') {

        console.log('================> invitee.created');

        const response: any = await Promise.all([
            // Get Task Number
            sequences.increment({ _id: 'task' }),
            // Get Event time
            axios.request({
                method: 'GET',
                url: payload.event,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`
                }
            }),
            // Get user with Coach
            dbGet(clients, { email: payload.email }, true, '_id firstName lastName email onboarding', 'onboarding.coach', '_id firstName lastName email', null, null, null, null, true),
            // Get Kanban Status
            dbGet(kanbans, { title: 'Pending' }, true, '_id title', null, null, null, null, null, null, true)
        ]);

        // console.log('-----------------Event name------------------');
        // console.log(response[1].data.resource.name);

        let taskData = {
            code: response[0],
            type: 'call',
            title: 'Call',
            dueDate: response[1].data.resource.start_time,
            eventURI: payload.event,
            cancelURI: payload.cancel_url,
            rescheduleURI: payload.reschedule_url,
            client: response[2]._id,
            assignedTo: response[2].onboarding.coach._id,
            status: {
                statusId: response[3]._id,
                title: response[3].title,
            }
        }

        const newTask: any = await dbSave(tasks, taskData);
        // dbUpdate(clients, { _id: response[2]._id }, { 'onboarding.callBooked': true })
        dbUpdate(kanbans, { _id: response[3]._id }, {
            $push: {
                tasks: {
                    $each: [{
                        taskId: newTask._id,
                        client: response[2]._id,
                        assignedTo: response[2].onboarding.coach._id
                    }],
                    $position: 0
                }
            }
        });

        dbSave(logs, { module: 'task', action: 'created', client: response[2]._id, entityId: newTask._id, data: newTask });

    } else if (body.event === 'invitee.canceled') {
        console.log('================> invitee.canceled');

        const task: any = await dbGet(tasks, { eventURI: payload.event, }, true, '_id client assignedTo', null, null, null, null, null, null, true);

        console.log(task);

        if (task) {
            const canceledStatus: any = await dbGet(kanbans, { title: 'Canceled' }, true, '_id title', null, null, null, null, null, null, true);

            await dbUpdate(tasks, { _id: task._id }, {
                status: {
                    title: canceledStatus.title,
                    statusId: canceledStatus._id,
                },
                completed: false,
            });

            // await dbUpdate(clients, { _id: task.client }, { 'onboarding.callBooked': false });

            await dbUpdate(kanbans, {}, {
                $pull: {
                    tasks: {
                        taskId: task._id
                    }
                }
            });

            await dbUpdate(kanbans, { _id: canceledStatus._id }, {
                $push: {
                    tasks: {
                        $each: [{
                            taskId: task._id,
                            client: task.client,
                            assignedTo: task.assignedTo,
                        }],
                        $position: 0
                    }
                }
            });

        }
    }

    return sendResponce(res, body);

}

export const stripeWebHook = async (req: Request, res: Response) => {
    const endpointSecret = 'whsec_43853cf41baa5ebcf039a823d9e38a5bdd950ab4a4638470b5fc8876f97e5f33';

    const sig = req.headers['stripe-signature'];
    const body = req.body;

    console.log('------------- stripeWebHook -----------------');
    console.log(body);
    console.log(sig);

    let event = null;

    try {

        event = webhooksConstructEvent(body, sig, endpointSecret);

        console.log('================================');
        console.log(event);


    } catch (err: any) {
        throw new GenericServerError(err);
        return;
    }
}

export const myLiveClasses = async (req: Request, res: Response) => {

    const response: any = await Promise.all([
        dbGet(clients, { _id: req.currentUser.id }, true, 'coin', null, null, null, null, null, null, true),
        dbGet(orders, { client: req.currentUser.id, completed: true, 'items.status': 'active', 'items.type': 'subscription-live' }, true, '_id items', null, null, { createdAt: -1 }, null, null, null, true),
        dbGet(schedule, {}, false, '_id title day deuration start end type zoom', null, null, null, null, null, null, true),
        dbGet(bookings, { client: req.currentUser.id }, false, null, "schedule", null, null, null, null, null, true)
    ]);

    sendResponce(res, {
        coin: response[0].coin || 500,
        order: response[1],
        schedule: response[2],
        bookings: response[3],
    });

}

export const bookLiveClass = async (req: Request, res: Response) => {

    const { schedule, slot, booking } = req.body;

    const newBooking: any = await dbSave(bookings, {
        schedule,
        slot,
        booking,
        client: req.currentUser.id,
        createdBy: req.currentUser.id
    });

    sendResponce(res, newBooking);
}

export const updateLiveClass = async (req: Request, res: Response) => {

    const id = req.params.id;
    const body = req.body;

    const updateBooking = await dbUpdate(
        bookings,
        { _id: id },
        {
            ...body,
            updatedBy: req.currentUser.id
        }
    );

    sendResponce(res, updateBooking);

}

export const listing = async (req: Request, res: Response) => {

    const body = req.body;

    let query: any = {
    };
    let select = null;
    let limit = 0;
    let skip = 0;
    let search = '';

    let populate = [{
        path: 'schedule',
        model: schedule,
    }, {
        path: 'client',
        model: clients,
        select: 'firstName lastName email'
    }];

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
        dbCount(bookings, query),
        dbGet(bookings, query, false, select, "schedule client", 'firstName lastName email title type day start', { createdAt: -1 }, limit, skip)
    ]);

    return sendResponce(res, {
        count: response[0],
        data: response[1],
    });

}