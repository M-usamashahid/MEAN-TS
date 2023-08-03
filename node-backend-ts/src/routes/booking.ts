import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { calendelyWebHookAPI, myLiveClasses, bookLiveClass, updateLiveClass, listing } from "../controllers/booking";


export default (app: Router) => {

    app.post('/webhook', calendelyWebHookAPI);

    app.post('/booking/calendely/webhook', calendelyWebHookAPI);

    app.get('/booking/myliveclasses', requireAuth, myLiveClasses);

    app.post("/booking/listing", requireAuth, listing);

    app.post('/booking/liveClass', requireAuth, bookLiveClass);

    app.put('/booking/liveClass/:id', requireAuth, updateLiveClass);

}