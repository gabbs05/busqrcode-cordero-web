import rutas from "@/models/rutas";
import { connectDB } from "@/libs/db";
import { ObjectId } from "mongodb";
import Rutas_id from "@/components/pages/Rutas_id";
import fiscales from "@/models/fiscales";

connectDB()

export default async function Home(props: { params: Promise<{ rut: any }> }) {
    const param = await props.params;
    const grupId = await param.rut
    if (!ObjectId.isValid(grupId)) {
        return
    }
    const unidad = await rutas.findOne({ _id: grupId });
    const fiscal = await fiscales.find();
    return (
        <>
            <Rutas_id ruta={JSON.stringify(unidad)} fiscales = {JSON.stringify(fiscal)} params={param} />
        </>
    )
}