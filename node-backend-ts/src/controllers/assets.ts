import { Request, Response } from "express";
import Busboy from "busboy";
import { sendResponce } from "../utils";
import { NotFoundError, GenericServerError } from "../errors";
import { uploadFile } from "../services";

export const create = async (req: Request, res: Response) => {

    let url = '';
    var busboy = Busboy({ headers: req.headers });

    let folder = '';
    let format = '';
    let fieldName: any = '';
    let tempName: any = '';

    // switch (body.format) {
    //     case 'image':
    //         folder = 'assets/images/'
    //         break;
    //     default:
    //         throw new NotFoundError();
    //         break;
    // }
    busboy.on('file', async (fieldname: string, file: any, filename: any) => {

        tempName = filename.filename.split('.');
        format = tempName[tempName.length - 1];
        fieldName = tempName[tempName.length - 2];

        if (!fieldName) {
            fieldName = Date.now().toString();
        }

        if (format == 'blob') {
            format = 'webm';
        }

        url = `https://eztoned-studio-assets.s3.amazonaws.com/${folder}${fieldName}.${format}`;

        url = await uploadFile(file, `${folder}${fieldName}.${format}`, `eztoned-studio-assets`, false, null);

    });

    busboy.on('close', async () => {
        try {
            sendResponce(res, { url, format });
        } catch (error) {
            console.log(error)
            throw new GenericServerError();
        }
    });
    req.pipe(busboy);
}