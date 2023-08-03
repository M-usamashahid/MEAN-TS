
let fromEmail = 'noreply@eztoned.com';
let sendgrid = require('@sendgrid/mail');
import { TemplateIds } from "../constants/sendGridConfig"

/**
 * @function : Get sendgrid api configuration from master API collection
 * for triggering sendgrid SDK functions.
 */
let key = true;
const getConfiguration = async () => {

    try {
        if (process.env.sendgrid) {

            sendgrid.setApiKey(process.env.sendgrid);
            key = true
        } else {
            key = false;
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * @function : Send a message from a sendgrid template.
 */
export const sendEmail = async (toEmail: String, subject: String, templateId: any, data: object) => {

    try {
        /**
         * Construct Email Message to Send
         */
        console.log('Going to Send Email: ' + subject);
        const msg = {
            to: toEmail,
            from: `Eztoned <${fromEmail}>`,
            subject: subject,
            templateId: TemplateIds.templates[templateId],
            dynamic_template_data: data
        };

        /**
         * Sending Email Using SendGrid SDK
         */

        if (key) {
            const response = await sendgrid.send(msg);
            console.log('Sent Email: ' + subject);
            return response;
        }
        return false

    } catch (error) {
        console.error(error)
        return false;
    }
}

/**
 * @function : Send a message from a html.
 */
export const sendHTMLEmail = async (toEmail: String, subject: String, contents: any) => {

    try {
        /**
         * Construct Email Message to Send
         */
        console.log('Going to Send Email: ' + subject);
        const msg = {
            to: toEmail,
            from: `Eztoned <${fromEmail}>`,
            subject: subject,
            text: contents,
            html: '<p>' + contents + '</p>',
        };

        /**
         * Sending Email Using SendGrid SDK
         */

        if (key) {
            const response = await sendgrid.send(msg);
            console.log('Sent Email: ' + subject);
            return response;
        }
        return false

    } catch (error) {
        console.error(error)
        return false;
    }
}

/**
 * Load Configuration on Server Start 
 * Mentioned it in app.js to load these configurations at server start
 */
getConfiguration();