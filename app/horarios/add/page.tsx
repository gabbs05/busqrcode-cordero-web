import horarios from "@/models/horarios";
import { connectDB } from "@/libs/db";
import Horarios_add from "@/components/pages/Horarios_add";
import rutas from "@/models/rutas";
import fiscales from "@/models/fiscales";
connectDB()

export default async function Home() {
    const rut = await rutas.find();
    const fis = await fiscales.find();

    return (
        <>
            <Horarios_add rutas={JSON.stringify(rut)} fiscales={JSON.stringify(fis)} />
        </>
    )
}