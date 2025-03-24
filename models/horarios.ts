import { Schema, model, models } from "mongoose";

const hora = new Schema(
    {
        FiscalA_id: {
            type: Schema.Types.ObjectId,
            ref: 'fiscales',
            required: true,
            trim: true,
        },
        FiscalB_id: {
            type: Schema.Types.ObjectId,
            ref: 'fiscales',
            required: true,
            trim: true,
        },
        tiempo_entre: {
            type: Number,
            required: true,
            trim: true,
        }
    }
)

const horarios = new Schema(
    {
        nombre: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        ruta_id:{
            type:  Schema.Types.ObjectId,
            ref: 'rutas',
            required: true,
            trim: true
        },
        horas: [hora],
    }
)

export default models.horarios || model("horarios", horarios);