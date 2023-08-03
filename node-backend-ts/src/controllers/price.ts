import { Request, Response } from "express";
import { sendResponce, dbGet, dbSave, dbUpdate } from "../utils";

import { NotFoundError, GenericServerError } from "../errors";

import { products } from "../models";

import { createPrices } from "../services";

import { envSubscription } from "../constants/pricing";

export const create = async (req: Request, res: Response) => {

    const body: any = req.body;

    const exist: any = await dbGet(products, { _id: body.packageId }, true, '_id stripeProductId', null, null, null, null, null, null, true);

    if (exist) {

        let priceObjForStripe: any = {
            product: exist.stripeProductId,
            currency: 'USD',
            unit_amount: body.unitAmount * 100,
        }

        if (body.type === 'recurring') {
            priceObjForStripe['recurring'] = {
                interval: body.recurring.interval,
                interval_count: body.recurring.intervalCount,
            }
        }

        try {

            const price = await createPrices(priceObjForStripe);

            await dbUpdate(products, { _id: body.packageId }, {
                $push: {
                    price: {
                        product: exist.stripeProductId,
                        currency: 'USD',
                        unitAmount: body.unitAmount * 100,
                        type: body.type,
                        recurring: {
                            interval: (body.recurring && body.recurring.interval) ? body.recurring.interval : null,
                            intervalCount: (body.recurring && body.recurring.intervalCount) ? body.recurring.intervalCount : 1,
                        },
                        stripePriceId: price.id,
                    }
                }
            });

            sendResponce(res, {
                ...priceObjForStripe,
                stripePriceId: price.id,
            });

        } catch (err: any) {
            throw new GenericServerError(err);
        }

    } else {
        throw new NotFoundError('Product Not Found');
    }

}

export const bulkCreate = async (req: Request, res: Response) => {

    const stripeUKProductId = 'eztoned_uk_subscription_v1';
    const stripeUSAProductId = 'eztoned_usa_subscription_v1';
    const stripeNZProductId = 'eztoned_nz_subscription_v1';

    try {

        let prices: any = [];

        let subscription = envSubscription[`${process.env.NODE_ENV}`];

        for (const main in subscription) {

            for (const property in subscription[main]) {

                let data = {
                    currency: property,
                    unit_amount: subscription[main][property].amount,
                    recurring: {
                        interval: "month",
                        interval_count: 1
                    }
                };

                if (main === 'subscription_quarterly') {
                    data.recurring.interval_count = 3;
                } else if (main === 'subscription_yearly') {
                    data.recurring.interval_count = 12;
                }

                // console.log(main, property, subscription[main][property]);


                prices.push(data);
            }

        }

        for (let index = 0; index < prices.length; index++) {
            const price = prices[index]

            console.log(price);
            // await createPrices({
            //     product: stripeUKProductId,
            //     ...price
            // });

            // USA Account
            // await createPrices({
            //     product: stripeUSAProductId,
            //     ...price
            // }, 'usa');

            // NZ Account
            // await createPrices({
            //     product: stripeNZProductId,
            //     ...price
            // }, 'nz');
        }

        sendResponce(res, true);

    } catch (err: any) {
        throw new GenericServerError(err);
    }

}

export const bulkCreateLiveClasses = async (req: Request, res: Response) => {

    const stripeUKProductId = 'eztoned_uk_live_classes_v2';
    const stripeNZProductId = 'eztoned_nz_live_classes_v2';

    try {

        let prices: any = [];

        let subscription = envSubscription[`${process.env.NODE_ENV}`];

        for (const main in subscription) {

            for (const property in subscription[main]) {

                let data = {
                    currency: property,
                    unit_amount: subscription[main][property].amount,
                    recurring: {
                        interval: "week",
                        interval_count: 1
                    }
                };

                // console.log(main, property, subscription[main][property]);

                prices.push(data);
            }

        }

        console.log(prices.length);

        for (let index = 0; index < prices.length; index++) {
            let price = prices[index];

            price.unit_amount = Math.round(price.unit_amount)

            console.log(price);
            // await createPrices({
            //     product: stripeUKProductId,
            //     ...price
            // });

            // NZ Account
            // await createPrices({
            //     product: stripeNZProductId,
            //     ...price
            // }, 'nz');
        }

        sendResponce(res, true);

    } catch (err: any) {
        throw new GenericServerError(err);
    }

}