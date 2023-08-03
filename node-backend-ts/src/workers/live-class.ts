import { CronJob } from "cron";
import { dbUpdateMany } from "../utils";
import { todayDate } from "../services";
import { bookings } from "../models";

const everyHour = '0 0 */1 * * *';
const everyMin = '0 */1 * * * *';

const removeBookings = new CronJob(
    everyHour,
    async () => {
        const time = todayDate().utcOffset(Number(12));

        const query = {
            'booking.year': time.format('YYYY'),
            'booking.month': time.format('M'),
            'booking.day': time.format('DD'),
            'slot.end.hour': time.format('HH')
        };

        const bookingRemoved: any = await dbUpdateMany(bookings, query, { $set: { isDeleted: true } }, { upsert: false });
        console.log('---- Booking Removed ----');
        console.log(query);
        console.log(bookingRemoved);
    });

removeBookings.start();