import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { create } from "../controllers/assets";

export default (app: Router) => {

    app.post(`/assets`, requireAuth, create);

}

