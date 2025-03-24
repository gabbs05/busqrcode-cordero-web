import unidades from "@/models/unidades";
import { connectDB } from "@/libs/db";
import Unidades from "@/components/pages/Unidades";
connectDB()
export default async function Home() {
    const unid = await unidades.find();
    const data = JSON.stringify(unid)

    return (
        <>
            <Unidades unidades={data} />
        </>
    )
}