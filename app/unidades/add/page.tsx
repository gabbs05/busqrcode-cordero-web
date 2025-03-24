import unidades from "@/models/unidades";
import { connectDB } from "@/libs/db";
import Unidades_add from "@/components/pages/Unidades_add";

connectDB()

export default async function Home() {
    return (
        <>
            <Unidades_add  />
        </>
    )
}