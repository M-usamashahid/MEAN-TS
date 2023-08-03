import { Router, Request, Response } from "express";
import { dbGet, dbRegister, dbSaveMany } from "../utils";
import { sendResponce } from "../utils";
import { BadRequestError } from "../errors";
import { users, kanbans, sequences, schedule } from "../models";
import { SeedUsers, SeedKanban, Sequence, Schedule } from "./data";

export default (app: Router) => {

    // Insert Super Admin User
    app.get("/seed/user", async (req: Request, res: Response) => {
        try {
            const isSuperAdminInitialized = await dbGet(
                users,
                { email: "superadmin@eztoned.com" },
                true
            );

            if (!isSuperAdminInitialized) {

                SeedUsers.forEach((user) => dbRegister(users, user));

                sendResponce(res, true);
            } else {
                throw new Error("Users already initialized");
            }
        } catch (error: any) {
            // console.error(error.message);
            throw new BadRequestError(error.message);
        }

    });

    app.get("/seed/kanban", async (req: Request, res: Response) => {
        try {
            const isKanbansInitialized: any = await dbGet(kanbans, {}, false);

            if (!isKanbansInitialized.length) {
                const SavedKanbans = await dbSaveMany(kanbans, SeedKanban);

                sendResponce(res, SavedKanbans);
            } else {
                throw new Error("Kanbans already initialized");
            }
        } catch (error: any) {
            // console.error(error.message);
            throw new BadRequestError(error.message);
        }

    });

    app.get("/seed/sequence", async (req: Request, res: Response) => {
        try {
            const isSeedSequence: any = await dbGet(sequences, {}, false);

            if (!isSeedSequence.length) {
                const savedTasks = await dbSaveMany(sequences, Sequence);

                sendResponce(res, savedTasks);
            } else {
                throw new Error("Sequence already initialized");
            }
        } catch (error: any) {
            // console.error(error.message);
            throw new BadRequestError(error.message);
        }

    });

    app.get("/seed/schedule", async (req: Request, res: Response) => {

        try {
            const isScheduleInitialized = await dbGet(
                schedule,
                {},
                true
            );

            const allClasses: any = [];

            if (!isScheduleInitialized) {

                Schedule.forEach((sch: any) => {

                    Object.keys(sch.days).forEach(key => {
                        allClasses.push({
                            ...sch,
                            day: key,
                            deuration: 60,
                            zoom: {
                                id: sch.days[key].id,
                                link: sch.days[key].link,
                            }
                        });
                    });

                });

                const SavedSchedule = await dbSaveMany(schedule, allClasses);

                sendResponce(res, SavedSchedule);
            } else {
                throw new Error("Schedule already initialized");
            }
        } catch (error: any) {
            // console.error(error.message);
            throw new BadRequestError(error.message);
        }

    })

}
