import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdateMany, dbAggregate, sendResponce } from "../utils";
import { events } from "../constants/socket";
import { emit } from "../services/socket/index";

import { chats, clients } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";

export const create = async (req: Request, res: Response) => {
    const { client, user, text, image, audio, video, document, sender } = req.body;

    const chatMessage: any = await dbSave(chats, { client, user, text, image, audio, video, sender, document, readed: (sender === user) ? true : false });

    if (sender === client) {
        emit(events.chat.coach, user, {
            message: chatMessage
        });
    } else {
        emit(events.chat.client, client, {
            message: chatMessage
        });
    }

    sendResponce(res, chatMessage);
}

export const allChats = async (req: Request, res: Response) => {

    const allChats: any = await dbAggregate(clients, [
        {
            $lookup:
            {
                from: 'chats',
                localField: '_id',
                foreignField: 'client',
                as: 'chats'
            },
        },
        {
            $project:
            {
                firstName: 1,
                lastName: 1,
                email: 1,
                chats:
                {
                    $filter:
                    {
                        input: "$chats",
                        as: "chats",
                        cond: {
                            $eq: ['$$chats.readed', false]
                        }
                    }
                }
            }
        },
        { $sort: { firstName: -1 } }
    ]);

    // sendResponce(res, allChats.filter((chat: any) => chat.chats.length));
    sendResponce(res, allChats);
}

export const chat = async (req: Request, res: Response) => {

    const id = req.params.clientId;

    const chat: any = await dbGet(chats, { client: id }, false, null, null, null, { createdAt: 1 }, null, null, null, true)

    sendResponce(res, chat);
}

export const markRead = async (req: Request, res: Response) => {
    const { client } = req.body;
    const chat: any = await dbUpdateMany(chats, { client }, { readed: true }, {});
    sendResponce(res, true);
}
