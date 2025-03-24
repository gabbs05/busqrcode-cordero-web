import { connectDB } from "@/libs/db";
import rutas from "@/models/rutas";
import { NextResponse } from "next/server";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { cookies } from "next/headers";

connectDB();
const jwtName = process.env.JWT_NAME;
if (!jwtName) {
  throw new Error("JWT_NAME is not defined in environment variables");
}
connectDB();
export async function POST(request: any) {
  const { nombre} = await request.json();
   const cookieStore = await cookies();
   const token: any = cookieStore.get(jwtName as any);
   try {
     jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
     const findUnidad = await rutas.findOne({ nombre });
     if (findUnidad) {
       return NextResponse.json(
         { error: "Ya existe una ruta con ese nombre" },
         { status: 401 }
       );
     }
     const newUnidad = new rutas({
       nombre,
     });
     const savedUnidad = await newUnidad.save();
     return NextResponse.json(savedUnidad);
   } catch (error) {
     return NextResponse.json((error as Error).message, { status: 400 });
   }
}

export async function PUT(request: any) {
  const { nombre, fiscales, _id } = await request.json();
  console.log(nombre, fiscales);
   const cookieStore = await cookies();
   const token: any = cookieStore.get(jwtName as any);

   try {
     jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
     const findNumero = await rutas.findOne({ nombre });
     if (findNumero && findNumero._id.toString() != _id) {
       return NextResponse.json(
         { error: "Ya existe un fiscal con este número" },
         { status: 401 }
       );
     }
     const updatedUnidad = await rutas.findOneAndUpdate(
       { _id },
       { nombre, fiscales }
     );
     if (!updatedUnidad) {
       return NextResponse.json(
         { error: "No se encuentra ningún fiscal con ese ID" },
         { status: 409 }
       );
     }
     return NextResponse.json(updatedUnidad);
   } catch (error) {
     console.log;
     return NextResponse.json((error as Error).message, { status: 400 });
   }
}

export async function DELETE(request: any) {
  const { id } = await request.json();
  console.log(id);
   const cookieStore = await cookies();
   const token: any = cookieStore.get(jwtName as any);

   try {
     jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
     const deletedUnidad = await rutas.findByIdAndDelete(id);
     if (!deletedUnidad) {
       return NextResponse.json(
         { error: "No se encuentra ninguna unidad con ese ID" },
         { status: 409 }
       );
     }
     return NextResponse.json(deletedUnidad);
   } catch (error) {
     console.log(error);
     return NextResponse.json((error as Error).message, { status: 400 });
   }
}
