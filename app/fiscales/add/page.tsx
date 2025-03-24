import { connectDB } from "@/libs/db";
import Fiscales_add from "@/components/pages/Fiscales_add";

connectDB()

export default async function Home() {
    return (
        <>
            <Fiscales_add />
        </>
    )
}