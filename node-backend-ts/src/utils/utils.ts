import { Request, Response } from "express";
import jwt, { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv-safe";

export const loadEnv = () => {
    const result: any = dotenv.config({
        allowEmptyValues: true
    });

    const { parsed: envs } = result;

    return envs;
};

export const jwtDecode = (token: any) => {
    return jwt.decode(token);
};

export const checkIfAJAXRequest = (req: any) => {
    return req.headers &&
        ((req.headers["x-requested-with"] &&
            req.headers["x-requested-with"] == "XMLHttpRequest") ||
            req.headers["content-type"].indexOf("application/json") != -1)
        ? true
        : false;
};

export const generateAuthToken = async (user: any) => {
    const ENV = loadEnv();

    return sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    }, ENV.JWT_KEY!);
}

type IClientInput = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    social: Object;
    questionnaire: Object;
    order: Object;
    onboarding: Object;
    stripeCustomerId: string;
};

export const generateClientAuthToken = async (client: IClientInput) => {
    const ENV = loadEnv();

    return sign({
        id: client._id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        questionnaire: client.questionnaire,
        order: client.order,
        onboarding: client.onboarding,
        stripeCustomerId: client.stripeCustomerId,
    }, ENV.JWT_KEY!);
}

export const verifyAuthToken = async (token: string) => {
    const ENV = loadEnv();

    return verify(token, ENV.JWT_KEY!);
}

export const sendResponce = (res: Response, data: any, statusCode: number = 200) => {
    return res.status(statusCode).send(data);
};
