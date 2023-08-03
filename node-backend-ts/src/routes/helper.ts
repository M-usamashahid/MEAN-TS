import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get } from "../controllers/helper";

export default (app: Router) => {

    app.get("/helper/studioagrement/:orderid", requireAuth, [
        param("orderid")
            .notEmpty()
            .withMessage("You must supply a ID")
    ],
        validateRequest, get);

}

