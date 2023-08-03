import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { clientNotesGet, create, update } from "../controllers/notes";

export default (app: Router) => {

    app.get("/notes/client/:client", requireAuth,
        [
            param("client")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing")
        ],
        validateRequest,
        clientNotesGet);

    app.post("/notes", requireAuth,
        [
            body("title")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing"),
            body("client")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing"),
            body("description")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing"),
            body("sent")
                .notEmpty()
                .withMessage("Required fields missing")
        ],
        validateRequest, create);

    app.put("/notes/:id", requireAuth,
        [
            param("id")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing"),
            body("title")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing"),
            body("description")
                .trim()
                .notEmpty()
                .withMessage("Required fields missing"),
            body("sent")
                .notEmpty()
                .withMessage("Required fields missing")
        ],
        validateRequest, update);

}