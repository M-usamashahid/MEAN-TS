import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, create, update, listing } from "../controllers/schedule";

export default (app: Router) => {

    app.post("/schedule/listing", requireAuth, listing);

    app.post("/schedule", requireAuth, [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing")
    ], validateRequest, create);

    app.put("/schedule/:id", requireAuth, [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing")
    ], validateRequest, update);

    app.get("/schedule/:id?", requireAuth, get);

}