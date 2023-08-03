import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { create, get, update, helper, calls } from "../controllers/tasks";

export default (app: Router) => {

    app.get("/task/helper/data", requireAuth, helper);

    app.get("/task/client/calls", requireAuth, calls);

    app.get("/task/:id?", requireAuth, get);

    app.put("/task/:id", requireAuth,
        [
            param("id")
                .notEmpty()
                .withMessage("You must supply a id"),
            body("title")
                .notEmpty()
                .withMessage("You must supply a title")
        ],
        validateRequest, update);

    app.post("/task", requireAuth,
        [
            body("title")
                .notEmpty()
                .withMessage("You must supply a title")
        ],
        validateRequest, create);

}

