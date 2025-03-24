import Index from "@/components/pages/Index";
import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import rutas from "@/models/rutas";
import horarios from "@/models/horarios";
import unidades from "@/models/unidades";
import fiscales from "@/models/fiscales";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export default async function Home(request:any) {
  connectDB();
  const cookieStore = await cookies();
  const jwt = cookieStore.get(process.env.JWT_NAME as any);
let payloadd = null;
  if (jwt) {
    try {
     payloadd = await jwtVerify(jwt.value, new TextEncoder().encode(process.env.JWT_SECRET));
      console.log(payloadd);
    } catch (error) {
      console.log(error);
    }
  }

  const timestamp = await timestamps.find();
  const ruta = await rutas.find()
  const horario = await horarios.find()
  const unidad = await unidades.find()
  const fiscal = await fiscales.find()
  return (
    <Index payload={payloadd} timestamps={JSON.stringify(timestamp)} horarios={JSON.stringify(horario)} rutas={JSON.stringify(ruta)}  unidades={JSON.stringify(unidad)} fiscales={JSON.stringify(fiscal)} />
  );
}
