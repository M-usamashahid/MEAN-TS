import { Request, Response } from "express";
import { sendResponce, dbGet, dbSave, dbUpdate } from "../utils";

import { GenericServerError } from "../errors";

import { products } from "../models";

import { createProduct } from "../services";

import { productPaymentMethods, subscriptionPaymentMethods } from "../constants/productPaymentMethods";
import { productEzbar, envSubscription } from "../constants/pricing";

export const checkoutProducts = async (req: Request, res: Response) => {

    let subscription = envSubscription[`${process.env.NODE_ENV}`];

    const data: any = {
        products: {
            product_ezbar: productEzbar,
            paymentMethods: productPaymentMethods
        },
        subscription: {
            ...subscription,
            paymentMethods: subscriptionPaymentMethods
        }
    };

    sendResponce(res, data);
}

export const bulkCreate = async (req: Request, res: Response) => {

    try {
        // const stripeUKProduct = await createProduct({
        //     id: 'eztoned_uk_subscription_v1',
        //     name: 'Eztoned UK: Subscription',
        // });

        // const stripeUSAProduct = await createProduct({
        //     id: 'eztoned_usa_subscription_v1',
        //     name: 'Eztoned USA: Subscription',
        // }, 'usa');

        // const stripeNZProduct = await createProduct({
        //     id: 'eztoned_nz_subscription_v1',
        //     name: 'Eztoned NZ: Subscription',
        // }, 'nz');

        // sendResponce(res, { stripeUKProduct, stripeUSAProduct, stripeNZProduct });
    } catch (err: any) {
        throw new GenericServerError(err);
    }
}

export const bulkCreateLiveClasses = async (req: Request, res: Response) => {

    try {
        const stripeUKProduct = await createProduct({
            id: 'eztoned_uk_live_classes_v2',
            name: 'Eztoned UK: Live Classes',
        });

        const stripeNZProduct = await createProduct({
            id: 'eztoned_nz_live_classes_v2',
            name: 'Eztoned NZ: Live Classes',
        }, 'nz');

        sendResponce(res, { stripeUKProduct, stripeNZProduct });
    } catch (err: any) {
        throw new GenericServerError(err);
    }
}

export const get = async (req: Request, res: Response) => {

    const type: string = req.params.type;

    const allProducts: any = await dbGet(products, { type }, true, '_id title type stripeProductId price', null, null, null, null, null, null, true);

    sendResponce(res, allProducts);

}

export const create = async (req: Request, res: Response) => {

    const body: any = req.body;

    const exist: any = await dbGet(products, { title: body.title }, true, '_id title', null, null, null, null, null, null, true);

    if (exist) {
        throw new GenericServerError('Product Already exists');
    } else {

        const packageObjForDB: any = {
            title: body.title,
            description: body.description,
            statementDescriptor: body.statementDescriptor,
            unitLabel: body.unitLabel,
            type: body.type,
        };

        const packageDbObject: any = await dbSave(products, packageObjForDB);

        const stripePackage = await createProduct({
            name: packageDbObject.title,
            description: (packageDbObject.description) ? packageDbObject.description : 'Description',
            statement_descriptor: packageDbObject.statementDescriptor,
            unit_label: packageDbObject.unitLabel,
            metadata: {
                appUID: packageDbObject._id.toString()
            },
            type: 'service'
        });

        await dbUpdate(products, {
            _id: packageDbObject._id
        }, {
            stripeProductId: stripePackage.id
        });

        sendResponce(res, packageDbObject);
    }

}