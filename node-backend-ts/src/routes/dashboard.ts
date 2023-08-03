import { Router } from "express";
import { body } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get } from "../controllers/dashboard";

export default (app: Router) => {

    app.get("/dashboard", requireAuth, get);

}