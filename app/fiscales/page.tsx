import fiscales from "@/models/fiscales";
import { connectDB } from "@/libs/db";
import Fiscales from "@/components/pages/Fiscales";
connectDB()
export default async function Home() {
    const fisc = await fiscales.find();
    const data = JSON.stringify(fisc)

    return (
        <>
            <Fiscales fiscales={data} />
        </>
    )
}