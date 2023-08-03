import { Schema } from "mongoose";

export const sheard: any = {
    createdBy: {
        type: Schema.Types.ObjectId,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false,
    }
}
