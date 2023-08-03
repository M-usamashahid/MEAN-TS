
import jwt from "jsonwebtoken";
let _io: any = null;

export const io = (io: any) => {

    io.use((socket: any, next: any) => {
        let handshake = socket.handshake;
        if (handshake.query.token) {

            const payload = jwt.verify(handshake.query.token, process.env.JWT_KEY!);

            if (payload) {
                console.log('socket new client connected');

                socket.request.session = payload;
                next();
            } else {
                console.log('Authentication failed or token has been expired')
                return socket.disconnect()
            }

        } else {
            return socket.disconnect()
        }
    });

    io.on('connection', (socket: any) => {

        socket.on('disconnect', () => {
            //   console.log(`Socket ${socket.id} disconnected.`);
        });

        _io = io;
    });
}

export const getIo = () => {
    return _io;
}