import { loadEnv } from "../utils";
import Stripe from "stripe";
let stripe: any = {
    uk: {},
    usa: {},
    nz: {},
};

/**
 * @function : Get Stripe api configuration from Setting API collection
 * for triggering Stripe SDK functions.
 */
const getConfiguration = async () => {

    try {

        let env = loadEnv();

        /**
         * get Stripe api configuration from apiSettings collection.
         *  */

        stripe['uk'] = new Stripe(`${env.STRIP_UK_SECRET_KEY}`, { apiVersion: '2020-08-27' });
        stripe['usa'] = new Stripe(`${env.STRIP_USA_SECRET_KEY}`, { apiVersion: '2020-08-27' });
        stripe['nz'] = new Stripe(`${env.STRIP_NZ_SECRET_KEY}`, { apiVersion: '2020-08-27' });

        return true;

    } catch (error: any) {
        console.error(error)
    }
}

/**
 * @function : Create a stripe Product.
 */
export const createProduct = async (obj: any, account: string = 'uk') => {
    try {

        return await stripe[account].products.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}


/**
 * @function : Create a stripe Product.
 */
export const getProducts = async (account: string = 'uk') => {
    try {

        return await stripe[account].products.list();
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Update a stripe Product.
 */
export const updateProduct = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].products.update(id, obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Delete a stripe Product.
 */
export const deleteProduct = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].products.del(id);
    } catch (error: any) {
        console.error(error)
        return false;
    }

}

/**
 * @function : Get a stripe Customers.
 */
export const listCustomers = async (account: string = 'uk') => {

    try {
        return await stripe[account].customers.list();
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

export const listCustomersByEmail = async (email: any, account: string = 'uk') => {

    try {

        return await stripe[account].customers.list({ email });
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Create a stripe Customers.
 */
export const createCustomer = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].customers.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Update a stripe Customers.
 */
export const customerUpdate = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].customers.update(id, obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Delete a stripe Customer.
 */
export const customerDelete = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].customers.del(id);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}


/**
 * @function : Create a stripe Product.
 */
export const getPrices = async (account: string = 'uk') => {
    try {

        return await stripe[account].prices.list();
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Create a stripe Prices Plan.
 */
export const createPrices = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].prices.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Update a stripe Prices Plan.
 */
export const updatePrices = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].prices.update(id, obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Retrieve a paymentMethods .
 */
export const retrievePaymentMethods = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].paymentMethods.list(id);
    } catch (error: any) {
        console.error(error)
        throw error.message;
    }
}

/**
 * @function : Detaches a PaymentMethod object from a Customer.
 */
export const detachPaymentMethod = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].paymentMethods.detach(id);
    } catch (error: any) {
        console.error(error)
        throw error.message;
    }
}

/**
 * @function : setup stripe setup Intents.
 */
export const setupIntents = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].setupIntents.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

export const paymentIntents = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].paymentIntents.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

export const checkoutSessions = async (obj: any, account: string = 'uk') => {
    try {

        return await stripe[account].checkout.sessions.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

export const paymentIntentsConfirm = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].paymentIntents.confirm(id, obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}



/**
 * @function : Retrieve a coupons.
 */
export const retrieveCoupons = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].coupons.list(id);
    } catch (error: any) {
        console.error(error)
        throw error.message;
    }
}

/**
 * @function : Create a stripe coupons.
 */
export const createCoupon = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].coupons.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Update a stripe coupons.
 */
export const updateCoupon = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].coupons.update(id, obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Delete a stripe coupons.
 */
export const deleteCoupon = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].coupons.del(id);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Create a stripe Subscriptions.
 */
export const retrieveSubscription = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].subscriptions.retrieve(id);
    } catch (error: any) {
        console.error(error)
        return error;
    }
}

/**
 * @function : Create a stripe Subscriptions.
 */
export const createSubscription = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].subscriptions.create(obj);
    } catch (error: any) {
        console.error(error)
        return error;
    }
}

/**
 * @function : Update a stripe Subscriptions.
 */
export const updateSubscription = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].subscriptions.update(id, obj);
    } catch (error: any) {
        console.error(error)
        return error;
    }
}

/**
 * @function : Update a stripe Subscriptions.
 */
export const updateSubscriptionItem = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].subscriptionItems.update(id, obj);
    } catch (error: any) {
        console.error(error)
        return error;
    }
}



/**
 * @function : Cancel a stripe Subscriptions.
 */
export const cancelSubscription = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].subscriptions.del(id);
    } catch (error: any) {
        console.error(error)
        return error;
    }
}


/**
 * @function : Retrieve a Tax Rates.
 */
export const retrieveTaxRates = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].taxRates.list(id);
    } catch (error: any) {
        console.error(error)
        throw error.message;
    }
}

/**
 * @function : Create a stripe Tax Rates.
 */
export const createTaxRate = async (obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].taxRates.create(obj);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Update a stripe Tax Rates.
 */
export const updateTaxRate = async (id: any, obj: any, account: string = 'uk') => {

    try {

        return await stripe[account].taxRates.update(id, obj);

    } catch (error: any) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Delete a stripe Tax Rates.
 */
export const deleteTaxRate = async (id: any, account: string = 'uk') => {

    try {

        return await stripe[account].taxRates.del(id);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}


export const webhooksConstructEvent = (body: any, sig: any, secret: any, account: string = 'uk') => {
    try {
        return stripe[account].webhooks.constructEvent(body, sig, secret);
    } catch (error: any) {
        console.error(error)
        return false;
    }
}

getConfiguration();