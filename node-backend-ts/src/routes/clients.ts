import { Router } from "express";
import { body, param } from "express-validator";
import {
  validateRequest,
  requireAuth,
} from "../middlewares";

import {
  listing,
  login,
  isPasswordSet,
  signUp,
  sociallogin,
  logout,
  paymentMethods,
  createSetupIntents,
  detachClientPaymentMethod,
  details,
  forgot,
  changePassword,
  resetPassword,
  onboarding,
  uScreenAccess,
  coinUpdate
} from "../controllers/clients";

export default (app: Router) => {

  app.post('/clients/detach/paymentmethod', requireAuth,
    [
      body("id")
        .notEmpty()
        .withMessage("You must supply a id"),
    ],
    validateRequest,
    detachClientPaymentMethod);

  app.post("/clients/login",
    [
      body("email").isEmail().withMessage("Email must be valid"),
      body("isPasswordSet").notEmpty().withMessage("Required fields missing"),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password"),
    ],
    validateRequest,
    login);

  app.post("/clients/ispasswordset",
    [
      body("email").isEmail().withMessage("Email must be valid"),
    ],
    validateRequest,
    isPasswordSet);


  app.post("/clients/signup",
    [
      body("firstName")
        .trim()
        .notEmpty()
        .withMessage("You must supply a first name"),
      body("lastName")
        .trim()
        .notEmpty()
        .withMessage("You must supply a last name"),
      body("email").isEmail().withMessage("Email must be valid"),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password")
    ],
    validateRequest,
    signUp);

  app.post("/clients/sociallogin", sociallogin);

  app.get("/clients/logout", requireAuth, logout);

  app.get("/clients/uscreen", requireAuth, uScreenAccess);

  app.get("/clients/paymentmethods", requireAuth, paymentMethods);

  app.get("/clients/onboarding/call/status", requireAuth, onboarding);

  app.get("/clients/setupintent", requireAuth, createSetupIntents);

  app.get("/clients/details/:id", requireAuth, [
    param("id")
      .notEmpty()
      .withMessage("You must supply a id"),
  ],
    validateRequest, details);

  app.post("/clients/listing", requireAuth, listing);

  app.post("/clients/forgot", [
    body("email").isEmail().withMessage("Email must be valid")
  ], validateRequest, forgot);

  app.post("/clients/resetpassword", [
    body("token").notEmpty().withMessage("Required fields missing"),
    body("password").notEmpty().withMessage("Required fields missing")
  ], validateRequest, resetPassword);

  app.post("/clients/changePassword", requireAuth, [
    body("password").notEmpty().withMessage("Required fields missing"),
    body("newPassword").notEmpty().withMessage("Required fields missing")
  ], validateRequest, changePassword);

  app.put("/clients/coinUpdate", requireAuth, [
    body("coin").notEmpty().withMessage("Required fields missing"),
  ], validateRequest, coinUpdate);
};
