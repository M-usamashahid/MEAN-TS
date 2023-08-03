import 'express-async-errors';
import { Server } from "socket.io";
import { dbConnect } from "./config";
import { loadEnv } from "./utils";

import { app } from './app';
import { io } from './services/socket/auth';

/**
 * Server entry function for the bootstraping
 *  */
const start = async () => {
    const ENV = loadEnv()

    let db: string = ENV.DB_URI;

    await dbConnect({ db });

    const server = app.listen(ENV.PORT, () => {
        console.log(
            `Server listening on Port: ${ENV.PORT} Environment: ${app.get("env")}`
        );
    });

    const socketInstance = new Server(server);

    io(socketInstance)
};
start();