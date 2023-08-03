import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors";
import { GenericServerError } from "../errors";

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (req.session?.jwt || req.headers["jwt"]) {
    try {

      if (!req.session?.jwt) {
        req.session = { jwt: req.headers["jwt"] };
      }

      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

      if (payload) {
        req.currentUser = payload;
        next();
      } else {
        throw new NotAuthorizedError();
      }
    } catch (e: any) {
      throw new GenericServerError(e.toString());
    }
  } else {
    throw new NotAuthorizedError("Token Not Provided");
  }
};
