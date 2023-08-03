import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { checkoutProducts, get, create, bulkCreate, bulkCreateLiveClasses } from "../controllers/products";

export default (app: Router) => {

    // app.post("/products", requireAuth,
    //     [
    //         body("title")
    //             .notEmpty()
    //             .withMessage("You must supply a Title")
    //     ],
    //     validateRequest, create);

    // app.post("/products", requireAuth, bulkCreateLiveClasses);

    app.get("/products", checkoutProducts);

    app.get("/products/:type", requireAuth,
        [
            param("type")
                .notEmpty()
                .withMessage("You must supply a Type")
        ],
        validateRequest,
        get);

}