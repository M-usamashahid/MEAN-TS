import { Request, Response } from "express";
import { compare } from "bcrypt";

import { dbGet, dbRegister, dbUpdate, dbCount } from "../utils";
import { users } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce, generateAuthToken } from "../utils";

declare global {
  interface Request {
    session?: any;
    currentUser?: any;
  }
}

export const login = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  let query = { email };
  const getUser: any = await dbGet(users, query, true);

  if (!getUser) {
    throw new NotAuthorizedError(
      "Either email or password was incorrect, please try again"
    );
  } else if (getUser && getUser.isDeleted) {
    throw new NotAuthorizedError(
      `You do not have access, please contact your admin`
    );
  } else if (getUser) {

    const result = await compare(password, getUser.password);

    if (result) {

      delete getUser.password;

      const jwt = await generateAuthToken(getUser);

      req.session = { jwt };

      sendResponce(res, { jwt });
    } else {
      throw new NotAuthorizedError(
        "Either email or password was incorrect, please try again"
      );
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session = null;

  sendResponce(res, true);
};

export const create = async (req: Request, res: Response) => {

  const { firstName, lastName, role, email, password } = req.body;

  const isExist: any = await dbGet(users, { email }, true, null, null, null, null, null, null, 'all', true);

  if (isExist && !isExist.isDeleted) {
    throw new NotAuthorizedError("User already exists");
  } else if (isExist && isExist.isDeleted) {
    throw new NotAuthorizedError("User was deleted.");
  } else {

    const newUser: any = await dbRegister(users, {
      firstName, lastName, role, email, password, createdBy: req.currentUser._id
    })

    sendResponce(res, newUser);
  }

}

export const get = async (req: Request, res: Response) => {

  let query: any = {};
  let isSingle = false;
  const id = req.params.id;

  if (id) {
    query = {
      _id: id,
    };
    isSingle = true;
  }

  const allUsers = await dbGet(users, query, isSingle, '-password');

  return sendResponce(res, allUsers);
}

export const listing = async (req: Request, res: Response) => {

  const body = req.body;

  let query: any = {
    role: { $in: ['admin', 'headcoach', 'coach'] }
  };
  let select = 'firstName lastName email role createdAt';
  let limit = 0;
  let skip = 0;
  let search = '';

  if (body.limit !== 0) {
    limit = body.limit;
  }

  if (body.skip !== 0) {
    skip = body.skip;
  }

  if (body.search) {
    search = body.search.toLowerCase();
    search = search.trim();
    search = search.replace(/\s/g, '.*');
    search = '.*' + search + '.*';

    query.$or = [{
      firstName: {
        $regex: search
      }
    },
    {
      lastName: {
        $regex: search
      }
    },
    {
      email: {
        $regex: search
      }
    },
    {
      phone: {
        $regex: search
      }
    }
    ]
  };

  const response = await Promise.all([
    dbCount(users, query),
    dbGet(users, query, false, select, null, null, { createdAt: -1 }, limit, skip)
  ]);

  return sendResponce(res, {
    count: response[0],
    data: response[1],
  });

}

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  const isExist = await dbGet(users, { _id: id }, true, null, null, null, null, null, null, null, true);

  if (isExist) {

    delete body.password;
    delete body.createdAt
    delete body.createdBy
    delete body.isDeleted

    await dbUpdate(
      users,
      { _id: id },
      {
        $set: {
          ...body,
          updatedBy: req.currentUser._id
        }
      }
    );

    return sendResponce(res, true);
  } else {
    throw new NotFoundError();
  }
}
