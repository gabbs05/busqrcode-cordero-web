import { Schema, model, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const fiscales = new Schema(
    {
        fiscal_id : {
            type: Schema.Types.ObjectId,
            ref: 'fiscales',
            required: true,
            trim:true,
            unique: true,
        },
        numero_ruta:{
            type: String,
            required: true,
            trim: true,
        },
    }
)

const rutas = new Schema(
    {
        nombre:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fiscales: [fiscales],

    }
)

export default models.rutas || model("rutas", rutas);