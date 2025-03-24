import rutas from "@/models/rutas";
import { connectDB } from "@/libs/db";
import Rutas from "@/components/pages/Rutas";
connectDB()
export default async function Home() {
    const fisc = await rutas.find();
    const data = JSON.stringify(fisc)

    return (
        <>
            <Rutas rutas={data} />
        </>
    )
}