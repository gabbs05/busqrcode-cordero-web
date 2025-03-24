import { connectDB } from "@/libs/db";
import Rutas_add from "@/components/pages/Rutas_add";

connectDB()

export default async function Home() {
    return (
        <>
            <Rutas_add />
        </>
    )
}