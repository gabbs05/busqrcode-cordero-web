import horarios from "@/models/horarios";
import { connectDB } from "@/libs/db";
import Horarios from "@/components/pages/Horarios";
import rutas from "@/models/rutas";
connectDB()
export default async function Home() {
    const hor = await horarios.find();
    const data = JSON.stringify(hor)
    const rut = await rutas.find();

    return (
        <>
            <Horarios horarios={data} rutas={JSON.stringify(rut)}/>
        </>
    )
}