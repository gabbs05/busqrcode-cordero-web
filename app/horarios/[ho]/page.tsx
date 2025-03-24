import horarios from "@/models/horarios";
import { connectDB } from "@/libs/db";
import Horarios_id from "@/components/pages/Horarios_id";
import rutas from "@/models/rutas";
import fiscales from "@/models/fiscales";
import { ObjectId } from "mongodb";
connectDB()
export default async function Home(props: { params: Promise<{ ho: any }> }) {
    const param = await props.params;
    const horId = await param.ho
    if (!ObjectId.isValid(horId)) {
        return
    }
    const rut = await rutas.find();
    const fis = await fiscales.find();
    const hor = await horarios.findOne({ _id: horId });

    return (
        <>
            <Horarios_id rutas={JSON.stringify(rut)} fiscales={JSON.stringify(fis)} horarios={JSON.stringify(hor)} params={param}/>
        </>
    )
}