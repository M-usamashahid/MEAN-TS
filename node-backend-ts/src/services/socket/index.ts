import { getIo } from "./auth";

export const emit = async (event: any, id: any, data: any) => {

    const io: any = getIo();
    let name;
    if (io) {
        name = `${event}${id}`;
        console.log(name, 'socket ---------------------------');

        io.emit(name, data);
    }
}