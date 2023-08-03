import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { create, chat, allChats, markRead } from "../controllers/chats";

export default (app: Router) => {

    app.get("/chats/all/chats", requireAuth, allChats);

    app.get("/chats/:clientId", requireAuth,
        [
            param("clientId")
                .notEmpty()
                .withMessage("Required fields missing"),
        ],
        validateRequest,
        chat);

    app.post("/chats/mark/read", requireAuth,
        [
            body("client")
                .notEmpty()
                .withMessage("Required fields missing")
        ],
        validateRequest, markRead);

    app.post("/chats/message", requireAuth,
        [
            body("client")
                .notEmpty()
                .withMessage("Required fields missing"),
            body("user")
                .notEmpty()
                .withMessage("Required fields missing")
        ],
        validateRequest, create);


}