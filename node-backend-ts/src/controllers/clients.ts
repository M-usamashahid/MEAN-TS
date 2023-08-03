import { Request, Response } from "express";
import { compare } from "bcrypt";

import { dbGet, dbRegister, dbSave, dbUpdate, dbCount } from "../utils";
import { clients, tasks, logs } from "../models";
import { loadEnv } from "../utils";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce, generateClientAuthToken, verifyAuthToken } from "../utils";

import { createCustomer, retrievePaymentMethods, setupIntents, detachPaymentMethod, listCustomersByEmail, sendEmail } from "../services";

const axios = require("axios").default;

export const listing = async (req: Request, res: Response) => {

    const body = req.body;

    let query: any = {};
    let select = 'firstName lastName email image stripeCustomerId order timezone social.type social.id createdAt';
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

        query = {
            $or: [{
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
    }

    const response = await Promise.all([
        dbCount(clients, query),
        dbGet(clients, query, false, select, null, null, { createdAt: -1 }, limit, skip)
    ]);

    return sendResponce(res, {
        count: response[0],
        data: response[1],
    });

}

export const signUp = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, stripeAccount } = req.body;

    const exist: any = await dbGet(clients, { email }, true, null, null, null, null, null, null, 'all', true);

    if (exist && !exist.isDeleted) {
        throw new NotAuthorizedError("User already exists");
    } else if (exist && exist.isDeleted) {
        throw new NotAuthorizedError("User was deleted.");
    } else {

        const newClient: any = await dbRegister(clients, {
            firstName, lastName, email, password, stripeAccount
        });

        // if customer exist in stripe
        // const existInStripe = await listCustomersByEmail(email);

        const customer = await createCustomer({
            email: newClient.email,
            name: `${newClient.firstName} ${newClient.lastName}`,
            metadata: {
                appUID: newClient._id.toString()
            }
        }, stripeAccount);

        await dbUpdate(clients, { _id: newClient._id }, {
            stripeCustomerId: customer.id
        });

        const updatedClient: any = await dbGet(clients, { _id: newClient._id }, true, null, null, null, null, null, null, null, true);

        dbSave(logs, { module: 'client', action: 'created', entityId: newClient._id, client: newClient._id, data: updatedClient });

        const jwt = await generateClientAuthToken(updatedClient);

        req.session = { jwt };

        sendResponce(res, { jwt });
    }

}

export const login = async (req: Request, res: Response) => {
    let { email, password, isPasswordSet } = req.body;

    let query = { email };
    let getUser: any = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);

    if (!getUser) {
        throw new NotAuthorizedError(
            "Either email or password was incorrect, please try again"
        );
    } else if (getUser && getUser.isDeleted) {
        throw new NotAuthorizedError(
            `You do not have access, please contact your admin`
        );
    } else if (getUser) {

        if (isPasswordSet === false) {

            const obj: any = new clients(req.body);
            const newPassword = obj.generateHash(password);

            await dbUpdate(clients, query, {
                password: newPassword
            });

            getUser = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);
        }

        const result = await compare(password, getUser.password);

        if (result) {

            delete getUser.password;

            const jwt = await generateClientAuthToken(getUser);

            req.session = { jwt };

            sendResponce(res, { jwt });
        } else {
            throw new NotAuthorizedError(
                "Either email or password was incorrect, please try again"
            );
        }
    }
}

export const isPasswordSet = async (req: Request, res: Response) => {
    let { email } = req.body;

    let query = { email };
    const getUser: any = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);

    console.log('-----------------------');
    console.log(getUser);

    if (!getUser) {
        throw new NotAuthorizedError(
            "Either email or password was incorrect, please try again"
        );
    } else if (getUser && getUser.isDeleted) {
        throw new NotAuthorizedError(
            `You do not have access, please contact your admin`
        );
    } else {
        sendResponce(res, { password: (getUser.password) ? true : false });
    }
}

export const sociallogin = async (req: Request, res: Response) => {

    const { id, firstName, lastName, email, provider, photoUrl, authToken, stripeAccount } = req.body;

    let exist: any = await dbGet(clients, { email }, true, null, null, null, null, null, null, 'all', true);

    if (exist && exist.isDeleted) {
        throw new NotAuthorizedError("User was deleted.");
    } else {

        if (!exist) {
            exist = await dbRegister(clients, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                image: photoUrl,
                stripeAccount: stripeAccount,
                social: [{
                    id: id,
                    token: authToken,
                    type: (provider === 'GOOGLE') ? 'google' : 'facebook'
                }]
            });

            const customer = await createCustomer({
                email: exist.email,
                name: `${exist.firstName} ${exist.lastName}`,
                metadata: {
                    appUID: exist._id.toString()
                }
            }, stripeAccount);

            await dbUpdate(clients, { _id: exist._id }, {
                stripeCustomerId: customer.id
            });

            exist = await dbGet(clients, { _id: exist._id }, true, null, null, null, null, null, null, 'all', true);

            dbSave(logs, { module: 'client', action: 'created', entityId: exist._id, client: exist._id, data: exist });

        }

        const jwt = await generateClientAuthToken(exist);

        req.session = { jwt };

        sendResponce(res, { jwt });
    }

}

export const paymentMethods = async (req: Request, res: Response) => {

    const paymentMethods = await retrievePaymentMethods({
        customer: req.currentUser.stripeCustomerId,
        type: 'card',
    });

    sendResponce(res, paymentMethods.data);
};

export const createSetupIntents = async (req: Request, res: Response) => {

    const ENV = loadEnv();

    const setup = await setupIntents({
        payment_method_types: ['card'],
        customer: req.currentUser.stripeCustomerId,
    });

    const data = {
        aKey: ENV.STRIP_UK_PUBLISHABLE_KEY,
        bKey: setup.client_secret,
    };

    sendResponce(res, data);
}

export const detachClientPaymentMethod = async (req: Request, res: Response) => {
    const { id } = req.body;

    const detach = await detachPaymentMethod(id);

    sendResponce(res, detach);
}

export const details = async (req: Request, res: Response) => {
    let query = { _id: req.params.id };
    let getClient: any = await dbGet(clients, query, true, "-password");

    return sendResponce(res, getClient);
}

export const logout = async (req: Request, res: Response) => {
    req.session = null;

    sendResponce(res, true);
};

export const forgot = async (req: Request, res: Response) => {
    const { email } = req.body;

    const getClient: any = await dbGet(clients, { email }, true, null, null, null, null, null, null, null, true);

    if (getClient) {

        const jwt = await generateClientAuthToken(getClient);

        const link = `${process.env.FRONTEND_URI!}/changePassword?token=${jwt}`;

        sendEmail(
            email,
            'Reset Pasword!',
            'resetPassword',
            {
                set_password_link: link
            }
        )

        sendResponce(res, true);

    } else {
        throw new NotFoundError("User not found");
    }

};

export const resetPassword = async (req: Request, res: Response) => {

    let { token, password } = req.body;

    const payload: any = await verifyAuthToken(token);

    if (payload) {

        const query = { email: payload.email };

        const getClient: any = await dbGet(clients, query, true);

        if (getClient) {

            const obj: any = new clients(req.body);
            const newPassword = obj.generateHash(password);

            await dbUpdate(clients, query, {
                password: newPassword
            });

            sendEmail(
                payload.email,
                'Pasword Changed!',
                'changePassword',
                {}
            )

            sendResponce(res, true);

        } else {
            throw new NotFoundError("User not found");
        }

    } else {
        throw new NotAuthorizedError();
    }

}

export const changePassword = async (req: Request, res: Response) => {
    let { password, newPassword } = req.body;

    let query = { _id: req.currentUser.id };

    let getUser: any = await dbGet(clients, query, true);

    if (!getUser) {
        throw new NotAuthorizedError(
            "Either email or password was incorrect, please try again"
        );
    } else if (getUser && getUser.suspended) {
        throw new NotAuthorizedError(
            `You do not have access, please contact your admin`
        );
    } else if (getUser) {
        const result = await compare(password, getUser.password);

        if (result) {

            const obj: any = new clients(req.body);
            const newPass = obj.generateHash(newPassword);

            await dbUpdate(clients, query, {
                password: newPass
            });

            sendEmail(
                getUser.email,
                'Pasword Changed!',
                'changePassword',
                {

                }
            )

            sendResponce(res, true);
        } else {
            throw new NotAuthorizedError(
                "Either email or password was incorrect, please try again"
            );
        }
    }

}

export const onboarding = async (req: Request, res: Response) => {

    const onBoardingDone: any = await dbGet(clients, { _id: req.currentUser.id, 'onboarding.callDone': true }, true, '_id title', null, null, null, null, null, null, true);

    if (onBoardingDone) {
        sendResponce(res, {
            onboarding: true,
            calls: []
        });
    } else {
        const onboardingTask: any = await dbGet(tasks, {
            client: req.currentUser.id,
            type: 'onboarding',
            completed: false,
            'status.title': {
                $in: ['Pending', 'In Progress']
            }
        }, false, '_id eventURI cancelURI rescheduleURI dueDate', null, null, null, null, null, null, true);
        sendResponce(res, {
            onboarding: false,
            calls: onboardingTask
        });
    }

}

export const uScreenAccess = async (req: Request, res: Response) => {

    if (req.currentUser.email) {

        try {

            const response = await axios.request({
                method: 'POST',
                url: `https://www.uscreen.io/publisher_api/v1/customers/${req.currentUser.email}/tokenized_url`,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.U_SCREEN
                }
            });

            sendResponce(res, response.data);

        } catch (error: any) {
            console.log(error.response.data)
            throw new NotAuthorizedError("You are not authorized to perform this action.");
        }

    } else {
        throw new NotFoundError("User not found");
    }

};

export const coinUpdate = async (req: Request, res: Response) => {

    const { _id, coin, } = req.body;

    let exist: any = await dbGet(clients, { _id }, true, null, null, null, null, null, null, 'all', true);

    if (exist && exist.isDeleted) {
        throw new NotAuthorizedError("User was deleted.");
    } else {

        const cointsUpdated = await dbUpdate(clients, { _id: exist._id }, { coin });

        sendResponce(res, cointsUpdated);
    }

}