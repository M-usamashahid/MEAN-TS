import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, create, update, listing } from "../controllers/programs";

export default (app: Router) => {

    app.post("/programs/listing", requireAuth, listing);

    app.post("/programs", requireAuth, [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing")
    ], validateRequest, create);

    app.put("/programs/:id", requireAuth, [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing")
    ], validateRequest, update);

    app.get("/programs/:id?", requireAuth, get);

}