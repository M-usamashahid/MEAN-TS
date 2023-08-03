import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { create, bulkCreate, bulkCreateLiveClasses } from "../controllers/price";

export default (app: Router) => {

    // app.post("/price/bulk", requireAuth, bulkCreateLiveClasses);

    app.post("/price", requireAuth,
        [
            body("packageId")
                .notEmpty()
                .withMessage("You must supply a Package Id")
        ],
        validateRequest, create);

}