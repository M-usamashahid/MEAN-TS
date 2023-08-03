import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, reArrangeKanban } from "../controllers/kanban";

export default (app: Router) => {

    app.get("/kanban/:id?", requireAuth, get);

    app.post("/kanban/reArrangeKanban", requireAuth,
        [
            body("statusChange")
                .notEmpty()
                .withMessage("You must supply a status Change"),
            body("column")
                .notEmpty()
                .withMessage("You must supply a column ID")
        ],
        validateRequest,
        reArrangeKanban);

}

