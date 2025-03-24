import fiscales from "@/models/fiscales";
import { connectDB } from "@/libs/db";
import { ObjectId } from "mongodb";
import Fiscales_id from "@/components/pages/Fiscales_id";

connectDB()

export default async function Home(props: { params: Promise<{ fisc: any }> }) {
    const param = await props.params;
    const grupId = await param.fisc
    if (!ObjectId.isValid(grupId)) {
        return
    }
    const fiscal = await fiscales.findOne({ _id: grupId });
    return (
        <>
            <Fiscales_id fiscal={JSON.stringify(fiscal)} params={param} />
        </>
    )
}