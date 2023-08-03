import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get } from "../controllers/logs";

export default (app: Router) => {

    app.get("/logs/:id", requireAuth, [
        param("id")
            .notEmpty()
            .withMessage("You must supply a ID")
    ],
        validateRequest, get);

}

