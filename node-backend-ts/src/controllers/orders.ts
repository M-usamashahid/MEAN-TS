import { Request, Response } from "express";
import { sendResponce, generateClientAuthToken, dbGet, dbSave, dbUpdate, dbCount, dbRegister } from "../utils";

import { clients, users, logs, orders } from "../models";

import { NotAuthorizedError, NotFoundError, GenericServerError } from "../errors";

import { createCustomer, customerUpdate, createSubscription, cancelSubscription, paymentIntents, setupIntents } from "../services";

import { v4 as uuidv4 } from "uuid";

const axios = require("axios").default;

const bizSdk = require('facebook-nodejs-business-sdk');
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const DeliveryCategory = bizSdk.DeliveryCategory;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

const access_token = process.env.PIXEL_TOKEN;
const pixel_id = process.env.PIXEL_ID;
const api = bizSdk.FacebookAdsApi.init(access_token);

export const create = async (req: Request, res: Response) => {
    let { firstName, lastName, phone, shippingAddress, billingAddress, shippingAddressSameAsBilling, stripePaymentMethodId, total, items } = req.body;

    let query = { _id: req.currentUser.id };
    let getClient: any = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);

    if (getClient && getClient.order.active === null) {

        let addressForStripe = shippingAddress;
        if (shippingAddressSameAsBilling === false) {
            addressForStripe = billingAddress;
        }

        const stripeCustomerObj = {
            name: `${firstName} ${lastName}`,
            phone: phone,
            address: {
                line1: addressForStripe.address1,
                line2: addressForStripe.address2,
                city: addressForStripe.city,
                state: (addressForStripe && addressForStripe.stateCode) ? addressForStripe.stateCode : null,
                postal_code: addressForStripe.zip,
                country: addressForStripe.countryCode,
            }
        };

        // Update Stripe Customer
        await customerUpdate(getClient.stripeCustomerId, stripeCustomerObj);

        let nItems = items.map((item: any) => { return { price: item.stripePriceId } })

        let subscriptionObj = {
            customer: getClient.stripeCustomerId,
            items: nItems,
            default_payment_method: stripePaymentMethodId,
            // trial_period_days: 7 // Add 7 days for trial periods
        }

        // Create Strip Subscription
        const stripeSubscription = await createSubscription(subscriptionObj);

        if (stripeSubscription.status !== 'active') {
            throw new NotAuthorizedError('Unable to Process Payment.');
        } else {

            const data = {
                order: {
                    line_items: [
                        {
                            variant_id: 40026753269896,
                            quantity: 1
                        }
                    ],
                    customer: {
                        id: 5533426385032
                    },
                    shipping_address: {
                        first_name: firstName,
                        last_name: lastName,
                        address1: addressForStripe.address1,
                        address2: addressForStripe.address2,
                        phone: phone,
                        city: addressForStripe.city,
                        province: addressForStripe.state,
                        country_code: addressForStripe.countryCode,
                        zip: addressForStripe.zip
                    }
                }
            };

            const config = {
                method: 'post',
                url: 'https://eztoned.myshopify.com/admin/api/2022-04/orders.json',
                headers: {
                    'X-Shopify-Access-Token': process.env.ShopifyAccessToken,
                    'Content-Type': 'application/json'
                },
                data
            };

            // Shopify order created
            const shopifyOrder = await axios(config);

            let orderItems = items.map((item: any) => {
                return {
                    title: 'EzToned',
                    status: 'active',
                    price: item._id,
                    stripeId: stripeSubscription.id,
                    priceCopy: item,
                    shopifyOrderId: JSON.stringify(shopifyOrder.data.order.id)
                }
            });

            const uScreenPassword = uuidv4();
            let uScreenCustomer = null;

            // Create U Screen Customer if not exist
            if (getClient.uscreen && getClient.uscreen.id === null) {

                try {

                    uScreenCustomer = await axios.request({
                        method: 'POST',
                        url: 'https://www.uscreen.io/publisher_api/v1/customers',
                        data: {
                            name: `${getClient.firstName} ${getClient.lastName}`,
                            email: getClient.email,
                            affiliate_id: 0,
                            password: uScreenPassword,
                            skip_invite: true
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.U_SCREEN
                        }
                    });

                    // Give access to uscreen product
                    axios.request({
                        method: 'POST',
                        url: `https://www.uscreen.io/publisher_api/v1/customers/${getClient.email}/accesses`,
                        data: {
                            product_id: 58343,
                            product_type: "freebie",
                            with_manual_billing: true
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.U_SCREEN
                        }
                    });

                } catch (e) {
                    console.log('--------------- Customer already exist in uscreen ---------------');
                }

            }

            const response: any = await Promise.all([
                // Create Order
                dbSave(orders, {
                    client: req.currentUser.id,
                    firstName,
                    lastName,
                    phone,
                    shippingAddress,
                    billingAddress,
                    stripePaymentMethodId,
                    items: orderItems,
                    total: total,
                    shippingAddressSameAsBilling,
                    completed: true
                }),
                // Get Coach
                dbGet(users, { email: 'headcoach@eztoned.com' }, true, "_id email"),
            ]);

            let subscriptionUserObj: any = {
                order: {
                    active: response[0]._id,
                    type: 'recurring'
                },
                'onboarding.coach': response[1]._id
            };

            if (uScreenCustomer && uScreenCustomer.data && uScreenCustomer.data.id) {
                subscriptionUserObj['uscreen'] = {
                    id: uScreenCustomer.data.id,
                    password: uScreenPassword
                }
            }

            await dbUpdate(clients, query, subscriptionUserObj);

            dbSave(logs, {
                module: 'order', action: 'created', client: req.currentUser.id, data: {
                    client: req.currentUser._id,
                    stripeId: stripeSubscription.id,
                    stripeResponse: stripeSubscription,
                    order: response[0]
                }
            });

            getClient = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);


            // Facebook Pixel
            let current_timestamp = Math.floor(Date.now() / 1000);
            const userData = (new UserData())
                .setEmails([getClient.email])
                .setClientIpAddress(req.connection.remoteAddress)
                .setClientUserAgent(req.headers['user-agent'])

            const content = (new Content()).setId(response[0]._id);

            const customData = (new CustomData())
                .setContents([content])
                .setCurrency('usd')
                .setValue(total.amount);

            const serverEvent = (new ServerEvent())
                .setEventName('Purchase')
                .setEventTime(current_timestamp)
                .setUserData(userData)
                .setCustomData(customData)
                .setEventSourceUrl('http://jaspers-market.com/product/123')
                .setActionSource('website');

            const eventsData = [serverEvent];
            const eventRequest = (new EventRequest(access_token, pixel_id))
                .setEvents(eventsData);

            eventRequest.execute()

            const jwt = await generateClientAuthToken(getClient);

            req.session = { jwt };

            sendResponce(res, { jwt });
        }

    } else {
        throw new NotAuthorizedError('Order already active');
    }
}

export const placeOrder = async (req: Request, res: Response) => {
    let { firstName, lastName, email, phone, shippingAddress, billingAddress, shippingAddressSameAsBilling, total, items, stripeAccount, allowedPaymentMethods } = req.body;

    let query = { email };
    let getClient: any = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);

    if (!getClient) {

        const newClient: any = await dbRegister(clients, {
            firstName,
            lastName,
            email,
            stripeAccount: stripeAccount
        });

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

        // @TODO Email customer to send email
        getClient = await dbGet(clients, query, true, null, null, null, null, null, null, null, true);
    }

    let addressForStripe = shippingAddress;
    if (shippingAddressSameAsBilling === false) {
        addressForStripe = billingAddress;
    }

    const stripeCustomerObj = {
        name: `${firstName} ${lastName}`,
        phone: phone,
        address: {
            line1: addressForStripe.address1,
            line2: addressForStripe.address2,
            city: addressForStripe.city,
            state: (addressForStripe && addressForStripe.stateCode) ? addressForStripe.stateCode : null,
            postal_code: addressForStripe.zip,
            country: addressForStripe.countryCode,
        },
    };

    // Update Stripe Customer
    await customerUpdate(getClient.stripeCustomerId, stripeCustomerObj, getClient.stripeAccount);

    try {
        const newOrder: any = await dbSave(orders, {
            client: getClient._id,
            firstName,
            lastName,
            phone,
            shippingAddress,
            billingAddress,
            allowedPaymentMethods,
            items,
            total,
            shippingAddressSameAsBilling,
            completed: false
        });

        sendResponce(res, newOrder);
    } catch (error: any) {
        console.log('-------------- error ---------------');
        console.log(error);
        throw new GenericServerError(error);
    }
}

export const getOrderPaymentmethods = async (req: Request, res: Response) => {
    const id = req.params.id;

    const order: any = await dbGet(orders, { _id: id, completed: false }, true, null, 'client', 'email', null, null, null, null, true);

    if (order && order._id) {

        // let address = null;
        // let paymentMethod = [
        //     {
        //         title: 'Card',
        //         value: 'card'
        //     }
        // ];

        // if (order.shippingAddressSameAsBilling) {
        //     address = order.shippingAddress;
        // } else {
        //     address = order.billingAddress;
        // }

        // if (address.countryCode === 'GB') {
        //     paymentMethod = [
        //         { title: 'Card', value: 'card' },
        //         { title: 'Afterpay/Clearpay', value: 'afterpay_clearpay' },
        //     ];
        // }

        return sendResponce(res, order);

    } else {
        throw new NotFoundError();
    }
}

export const getPaymentIntent = async (req: Request, res: Response) => {

    const { orderid, method } = req.body;

    const order: any = await dbGet(orders, { _id: orderid, completed: false }, true, null, 'client', 'email stripeCustomerId firstName lastName stripeAccount', null, null, null, null, true);

    // order.completed === false
    if (order && order._id) {

        await dbUpdate(orders, { _id: orderid }, { paymentMethodType: method });

        let aKeys: any = {
            uk: process.env.STRIP_UK_PUBLISHABLE_KEY,
            usa: process.env.STRIP_USA_PUBLISHABLE_KEY,
            nz: process.env.STRIP_NZ_PUBLISHABLE_KEY,
        }

        if (order.items[0].type === 'subscription' || order.items[0].type === 'subscription-live') {

            const setup = await setupIntents({
                payment_method_types: [method],
                customer: order.client.stripeCustomerId,
                metadata: {
                    orderId: order._id.toString()
                }
            }, order.client.stripeAccount);

            return sendResponce(res, {
                aKey: aKeys[order.client.stripeAccount],
                client_secret: setup.client_secret,
                order: order
            });

        } else {

            const stripePaymentIntents = await paymentIntents({
                amount: order.total.amount * 100,
                currency: order.total.currency,
                payment_method_types: [method], //afterpay_clearpay
                customer: order.client.stripeCustomerId,
                metadata: {
                    orderId: order._id.toString()
                }
                // automatic_payment_methods: {
                //     enabled: true,
                // },
            }, order.client.stripeAccount);

            return sendResponce(res, {
                ...stripePaymentIntents,
                aKey: aKeys[order.client.stripeAccount],
                order: order
            });
        }

    } else {
        throw new NotFoundError();
    }
}

export const confirmOrder = async (req: Request, res: Response) => {
    let { orderId } = req.body;

    let query = { _id: orderId };
    let getOrder: any = await dbGet(orders, query, true, null, 'client', null, null, null, null, null, true);
    let orderItem = null;
    let isPasswordSet: boolean = false;

    if (getOrder.client && getOrder.client.password) {
        isPasswordSet = true;
    }

    if (getOrder.items.length) {
        orderItem = getOrder.items[0];

        if (orderItem.status !== 'unpaid' && orderItem.type !== 'subscription') {
            return sendResponce(res, { email: getOrder.client.email, isPasswordSet });
        }
    }

    let addressForStripe = getOrder.shippingAddress;
    if (getOrder.shippingAddressSameAsBilling === false) {
        addressForStripe = getOrder.billingAddress;
    }

    const data = {
        order: {
            line_items: [
                {
                    variant_id: 40026753269896,
                    quantity: 1
                }
            ],
            customer: {
                id: 5533426385032
            },
            shipping_address: {
                first_name: getOrder.firstName,
                last_name: getOrder.lastName,
                address1: addressForStripe.address1,
                address2: addressForStripe.address2,
                phone: getOrder.phone,
                city: addressForStripe.city,
                province: addressForStripe.state,
                country_code: addressForStripe.countryCode,
                zip: addressForStripe.zip
            }
        }
    };

    const config = {
        method: 'post',
        url: 'https://eztoned.myshopify.com/admin/api/2022-04/orders.json',
        headers: {
            'X-Shopify-Access-Token': process.env.ShopifyAccessToken,
            'Content-Type': 'application/json'
        },
        data
    };

    // Shopify order created
    const shopifyOrder = await axios(config);

    await dbUpdate(orders, { 'items._id': orderItem._id }, {
        $set: {
            'items.$.status': 'active',
            'items.$.shopifyOrderId': JSON.stringify(shopifyOrder.data.order.id),
            'items.$.active': true
        }
    });

    await dbUpdate(orders, query, {
        completed: true
    });

    let subscriptionUserObj: any = {
        order: {
            active: orderId,
            type: 'onetime'
        },
    };

    await dbUpdate(clients, { _id: getOrder.client._id }, subscriptionUserObj);

    // dbSave(logs, {
    //     module: 'order', action: 'created', client: req.currentUser.id, data: {
    //         client: req.currentUser._id,
    //         paymentIntentId: paymentIntent.id,
    //         paymentIntent: paymentIntent,
    //         order: buyNowOrder
    //     }
    // });

    // Facebook Pixel
    let current_timestamp = Math.floor(Date.now() / 1000);
    const userData = (new UserData())
        .setEmails([getOrder.client.email])
        .setClientIpAddress(req.connection.remoteAddress)
        .setClientUserAgent(req.headers['user-agent'])

    const content = (new Content()).setId(orderId);

    const customData = (new CustomData())
        .setContents([content])
        .setCurrency('usd')
        .setValue(getOrder.total.amount);

    const serverEvent = (new ServerEvent())
        .setEventName('Purchase')
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl(`https://ezbar.eztoned.com/app/thank-you?order_id=${orderId}`)
        .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = (new EventRequest(access_token, pixel_id))
        .setEvents(eventsData);

    eventRequest.execute();

    sendResponce(res, { email: getOrder.client.email, isPasswordSet });
}

export const confirmSubscription = async (req: Request, res: Response) => {
    let { orderId, paymentMethod } = req.body;

    let query = { _id: orderId };
    let getOrder: any = await dbGet(orders, query, true, null, 'client', null, null, null, null, null, true);
    let orderItem = null;

    if (getOrder.items.length) {
        orderItem = getOrder.items[0];

        if (orderItem.status !== 'unpaid') {
            return sendResponce(res, { success: true });
        }
    }

    let nItems = getOrder.items.map((item: any) => { return { price: item.stripePriceId } })

    let subscriptionObj: any = {
        customer: getOrder.client.stripeCustomerId,
        items: nItems,
        default_payment_method: paymentMethod,
        // trial_period_days: 7 // Add 7 days for trial periods
    }

    if (orderItem.type === 'subscription-live' && orderItem.weeklyClasses === 3) {
        subscriptionObj['trial_period_days'] = 7;
    }

    try {
        // Create Strip Subscription
        const stripeSubscription = await createSubscription(subscriptionObj, getOrder.client.stripeAccount);
        if (stripeSubscription.status === 'trialing' || stripeSubscription.status === 'active') {

            let addressForStripe = getOrder.shippingAddress;
            if (getOrder.shippingAddressSameAsBilling === false) {
                addressForStripe = getOrder.billingAddress;
            }

            if (orderItem.type === 'subscription') {

                const data = {
                    order: {
                        line_items: [
                            {
                                variant_id: 40026753269896,
                                quantity: 1
                            }
                        ],
                        customer: {
                            id: 5533426385032
                        },
                        shipping_address: {
                            first_name: getOrder.client.firstName,
                            last_name: getOrder.client.lastName,
                            address1: addressForStripe.address1,
                            address2: addressForStripe.address2,
                            phone: getOrder.phone,
                            city: addressForStripe.city,
                            province: addressForStripe.state,
                            country_code: addressForStripe.countryCode,
                            zip: addressForStripe.zip
                        }
                    }
                };

                const config = {
                    method: 'post',
                    url: 'https://eztoned.myshopify.com/admin/api/2022-04/orders.json',
                    headers: {
                        'X-Shopify-Access-Token': process.env.ShopifyAccessToken,
                        'Content-Type': 'application/json'
                    },
                    data
                };

                // Shopify order created
                const shopifyOrder = await axios(config);

                await dbUpdate(orders, { 'items._id': orderItem._id }, {
                    $set: {
                        'items.$.status': 'active',
                        'items.$.shopifyOrderId': JSON.stringify(shopifyOrder.data.order.id),
                        'items.$.active': true,
                        'items.$.stripeSubscriptionId': stripeSubscription.id,
                    }
                });
            } else if (orderItem.type === 'subscription-live') {
                await dbUpdate(orders, { 'items._id': orderItem._id }, {
                    $set: {
                        'items.$.status': 'active',
                        'items.$.active': true,
                        'items.$.stripeSubscriptionId': stripeSubscription.id,
                    }
                });
            }

            await dbUpdate(orders, query, {
                completed: true
            });

            const uScreenPassword = uuidv4();
            let uScreenCustomer = null;

            // Create U Screen Customer if not exist
            if (getOrder.client.uscreen && getOrder.client.uscreen.id === null) {

                try {

                    uScreenCustomer = await axios.request({
                        method: 'POST',
                        url: 'https://www.uscreen.io/publisher_api/v1/customers',
                        data: {
                            name: `${getOrder.client.firstName} ${getOrder.client.lastName}`,
                            email: getOrder.client.email,
                            affiliate_id: 0,
                            password: uScreenPassword,
                            skip_invite: true
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.U_SCREEN
                        }
                    });

                    // Give access to uscreen product
                    axios.request({
                        method: 'POST',
                        url: `https://www.uscreen.io/publisher_api/v1/customers/${getOrder.client.email}/accesses`,
                        data: {
                            product_id: 58343,
                            product_type: "freebie",
                            with_manual_billing: true
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.U_SCREEN
                        }
                    });

                } catch (e) {
                    console.log('--------------- Customer already exist in uscreen ---------------');
                }

            }

            let subscriptionUserObj: any = {
                order: {
                    active: orderId,
                    type: 'recurring'
                },
            };

            if (uScreenCustomer && uScreenCustomer.data && uScreenCustomer.data.id) {
                subscriptionUserObj['uscreen'] = {
                    id: uScreenCustomer.data.id,
                    password: uScreenPassword
                }
            }

            await dbUpdate(clients, { _id: getOrder.client._id }, subscriptionUserObj);


            // Facebook Pixel
            let current_timestamp = Math.floor(Date.now() / 1000);
            const userData = (new UserData())
                .setEmails([getOrder.client.email])
                .setClientIpAddress(req.connection.remoteAddress)
                .setClientUserAgent(req.headers['user-agent'])

            const content = (new Content()).setId(orderId);

            const customData = (new CustomData())
                .setContents([content])
                .setCurrency('usd')
                .setValue(getOrder.total.amount);

            const serverEvent = (new ServerEvent())
                .setEventName('Purchase')
                .setEventTime(current_timestamp)
                .setUserData(userData)
                .setCustomData(customData)
                .setEventSourceUrl(`https://ezbar.eztoned.com/app/thank-you?order_id=${orderId}`)
                .setActionSource('website');

            const eventsData = [serverEvent];
            const eventRequest = (new EventRequest(access_token, pixel_id))
                .setEvents(eventsData);

            eventRequest.execute();

            sendResponce(res, { success: true });
        } else {
            throw new NotAuthorizedError('Unable to Process Payment.');
        }

    } catch (error: any) {
        console.log('-------------- error ---------------');
        console.log(error);
        throw new GenericServerError(error);
    }
}

export const clientMyOrders = async (req: Request, res: Response) => {

    const response = await Promise.all([
        dbGet(orders, { client: req.currentUser.id, completed: true, 'items.status': 'active' }, false, null, null, null, { createdAt: -1 }, null, null, null, true),
        dbGet(orders, { client: req.currentUser.id, completed: true, 'items.status': 'active', 'items.type': 'subscription' }, false, null, null, null, { createdAt: -1 }, null, null, null, true),
        dbGet(orders, { client: req.currentUser.id, completed: true, 'items.status': 'active', 'items.type': 'subscription-live' }, false, null, null, null, { createdAt: -1 }, null, null, null, true),
        dbGet(orders, { client: req.currentUser.id, completed: true, 'items.status': 'active', 'items.type': 'product' }, false, null, null, null, { createdAt: -1 }, null, null, null, true)
    ]);

    sendResponce(res, { allOrders: response[0], subscriptions: response[1], liveSubscriptions: response[2], product: response[3] });
}

export const cancel = async (req: Request, res: Response) => {

    let { _id, reason } = req.body;

    let getOrder: any = await dbGet(orders, { 'items._id': _id }, true, null, null, null, null, null, null, null, true);

    if (getOrder && getOrder._id) {

        await dbUpdate(orders, { 'items._id': _id }, {
            $set: {
                'items.$.status': 'cancel-requested',
                'items.$.cancelRequestedAt': new Date(),
                'items.$.active': false,
                'items.$.cancelReason': reason,
            }
        });

        sendResponce(res, true);

    } else {
        throw new NotFoundError();
    }
}

export const cancelByAdmin = async (req: Request, res: Response) => {

    let { _id } = req.body;

    let getOrder: any = await dbGet(orders, { 'items._id': _id }, true, null, null, null, null, null, null, null, true);

    if (getOrder && getOrder._id) {

        let selectedItem = getOrder.items.filter((item: any) => item._id.toString() === _id)[0];

        const stripeResponse = await cancelSubscription(selectedItem.stripeSubscriptionId);

        if (stripeResponse.statusCode == 400) {
            throw new NotAuthorizedError(stripeResponse.raw.message);
        } else {

            await dbUpdate(clients, { _id: getOrder.client }, {
                order: {
                    active: null,
                },
                'onboarding.coach': null
            });

            await dbUpdate(orders, { 'items._id': _id }, {
                $set: {
                    'items.$.status': 'cancelled',
                    'items.$.cancelApprovedAt': new Date(),
                    'items.$.active': false,
                    'items.$.weeklyClasses': 0,
                }
            });

            let subscriptionStripeResponce = {
                client: getOrder.client,
                stripeId: selectedItem.stripeId,
                stripeResponse: stripeResponse,
                type: 'canceled'
            };

            dbSave(logs, { module: 'order', action: 'cancelled', client: getOrder.client, data: subscriptionStripeResponce });

            sendResponce(res, true);
        }

    } else {
        throw new NotFoundError();
    }
}

export const status = async (req: Request, res: Response) => {
    let query = { _id: req.currentUser.id };
    let getClient: any = await dbGet(clients, query, true, "_id subscription questionnaire onboarding");

    sendResponce(res, getClient);
}

export const getClientSubscription = async (req: Request, res: Response) => {
    let query = { _id: req.currentUser.id };
    let getClient: any = await dbGet(clients, query, true, "_id order");

    if (getClient) {

        if (getClient.order.active) {

            const activeOrder = await dbGet(orders, { _id: getClient.order.active }, true, 'items createdAt');

            sendResponce(res, { order: activeOrder });
        } else {
            sendResponce(res, { order: null });
        }

    } else {
        throw new NotFoundError();
    }
}

export const getTrackingDetails = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const order: any = await dbGet(orders, { _id: orderId }, true, 'items');

    let shopifyOrder: any = null;
    order.items.map((item: any) => {
        if (item.shopifyOrderId) {
            shopifyOrder = item;
        }
    });

    if (shopifyOrder) {

        if (shopifyOrder.orderTrackingId && shopifyOrder.orderTrackingURL) {

            sendResponce(res, {
                shopifyOrderId: shopifyOrder.shopifyOrderId,
                trackingId: shopifyOrder.orderTrackingId,
                trackingURL: shopifyOrder.orderTrackingURL
            });
        } else {
            const config: any = {
                method: 'get',
                url: `https://eztoned.myshopify.com/admin/api/2022-04/orders/${shopifyOrder.shopifyOrderId}.json`,
                headers: {
                    'X-Shopify-Access-Token': process.env.ShopifyAccessToken,
                    'Content-Type': 'application/json'
                }
            };

            try {

                // Shopify order created
                const orderDetails = await axios(config);

                if (orderDetails && orderDetails.data && orderDetails.data.order.fulfillments && orderDetails.data.order.fulfillments.length) {

                    await dbUpdate(orders, { 'items._id': shopifyOrder._id }, {
                        $set: {
                            'items.$.orderTrackingId': orderDetails.data.order.fulfillments[0].tracking_number,
                            'items.$.orderTrackingURL': orderDetails.data.order.fulfillments[0].tracking_url,
                        }
                    });

                    sendResponce(res, {
                        shopifyOrderId: shopifyOrder.shopifyOrderId,
                        trackingId: orderDetails.data.order.fulfillments[0].tracking_number,
                        trackingURL: orderDetails.data.order.fulfillments[0].tracking_url,
                    });

                } else {
                    sendResponce(res, {
                        shopifyOrderId: shopifyOrder.shopifyOrderId,
                        trackingId: null,
                        trackingURL: null
                    });
                }
            } catch (e: any) {

                sendResponce(res, {
                    shopifyOrderId: shopifyOrder.shopifyOrderId,
                    trackingId: null,
                    trackingURL: null
                });
            }
        }

    } else {
        throw new NotFoundError();
    }
}

export const listing = async (req: Request, res: Response) => {

    const body = req.body;

    let query: any = {
        'items.status': { $in: ['active', 'cancel-requested', 'cancelled', 'unpaid'] }
    };
    let select = null
    let limit = 0;
    let skip = 0;

    if (body.limit !== 0) {
        limit = body.limit;
    }

    if (body.skip !== 0) {
        skip = body.skip;
    }

    const response = await Promise.all([
        dbCount(orders, query),
        dbGet(orders, query, false, select, 'client', 'email', { 'items.status': 1, createdAt: -1 }, limit, skip)
    ]);

    return sendResponce(res, {
        count: response[0],
        data: response[1],
    });

}

export const getOrder = async (req: Request, res: Response) => {
    const id = req.params.id;

    const order: any = await dbGet(orders, { _id: id }, true, null, 'client', 'email', null, null, null, null, true);

    if (order) {

        return sendResponce(res, order);

    } else {
        throw new NotFoundError();
    }
}

