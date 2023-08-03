import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { create, placeOrder, confirmOrder, confirmSubscription, cancel, getClientSubscription, status, listing, getOrder, getOrderPaymentmethods, getPaymentIntent, getTrackingDetails, cancelByAdmin, clientMyOrders } from "../controllers/orders";

export default (app: Router) => {

    // app.post("/subscription", requireAuth,
    //     [
    //         body("firstName")
    //             .notEmpty()
    //             .withMessage("You must supply a First Name"),
    //         body("lastName")
    //             .notEmpty()
    //             .withMessage("You must supply a Last Name"),
    //         body("stripePaymentMethodId")
    //             .notEmpty()
    //             .withMessage("You must supply a Payment Method"),
    //     ],
    //     validateRequest,
    //     create);

    app.post("/placeorder",
        [
            body("firstName")
                .notEmpty()
                .withMessage("You must supply a First Name"),
            body("lastName")
                .notEmpty()
                .withMessage("You must supply a Last Name"),
            body("email").isEmail().withMessage("Email must be valid"),
        ],
        validateRequest,
        placeOrder);

    app.post("/paymentintent",
        [
            body("orderid")
                .notEmpty()
                .withMessage("You must supply a order id"),

            body("method")
                .notEmpty()
                .withMessage("You must supply a payment method")
        ],
        validateRequest,
        getPaymentIntent);

    app.post("/confirmorder",
        [
            body("orderId")
                .notEmpty()
                .withMessage("You must supply a orderId")
        ],
        validateRequest,
        confirmOrder);

    app.post("/confirmsubscription",
        [
            body("orderId")
                .notEmpty()
                .withMessage("You must supply a orderId"),
            body('paymentMethod')
                .notEmpty()
                .withMessage("You must supply a paymentMethod"),
        ],
        validateRequest,
        confirmSubscription);

    app.get("/subscription/client/status", requireAuth, status);

    app.post("/subscription/cancel/request", requireAuth,
        [
            body("_id")
                .notEmpty()
                .withMessage("You must supply a id"),
            body("reason")
                .notEmpty()
                .withMessage("You must supply a reason"),
        ],
        validateRequest, cancel);

    app.post("/subscription/cancel/by/admin", requireAuth,
        [
            body("_id")
                .notEmpty()
                .withMessage("You must supply a id")
        ],
        validateRequest, cancelByAdmin);

    app.get("/subscription", requireAuth, getClientSubscription);

    app.get("/orders/myorders", requireAuth, clientMyOrders);

    app.get("/orders/details/:id",
        [
            param("id")
                .notEmpty()
                .withMessage("You must supply a order id"),

        ],
        validateRequest,
        getOrder);

    app.get("/orders/paymentmethods/:id",
        [
            param("id")
                .notEmpty()
                .withMessage("You must supply a order id"),

        ],
        validateRequest,
        getOrderPaymentmethods);

    app.get("/order/:orderId", requireAuth, getTrackingDetails);

    app.post("/orders/listing", requireAuth, listing);

}