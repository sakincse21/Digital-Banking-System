import { model, Schema } from "mongoose";
import { IFees } from "./fees.interface";
const FeesSchema = new Schema<IFees>({
    transactionId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }
},{
    timestamps:true,
    versionKey: false
})


export const Fees = model<IFees>("Fees",FeesSchema)