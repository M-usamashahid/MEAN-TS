import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, update } from "../controllers/questionnaire";

export default (app: Router) => {

    app.post("/questionnaire", requireAuth, update);

    app.get("/questionnaire", requireAuth, get);

}