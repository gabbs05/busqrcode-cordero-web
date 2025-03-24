import { connectDB } from "@/libs/db";
import rutas from "@/models/rutas";
import { NextResponse } from "next/server";
import horarios from "@/models/horarios";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { cookies } from "next/headers";

connectDB();
const jwtName = process.env.JWT_NAME;
if (!jwtName) {
  throw new Error("JWT_NAME is not defined in environment variables");
}
 

export async function POST(request: any) {
  const { nombre, horas, ruta_id } = await request.json();
   const cookieStore = await cookies();
   const token: any = cookieStore.get(jwtName as any);
  
  try {
     jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
    const findHorario = await horarios.findOne({ nombre });
    if (findHorario) {
      return NextResponse.json(
        { error: "Ya existe un horario con ese nombre" },
        { status: 401 }
      );
    }
    const newHorario = new horarios({
      nombre, horas, ruta_id
    });
    const savedUnidad = await newHorario.save();
    return NextResponse.json(savedUnidad);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

export async function PUT(request: any) {
  const { nombre, horas, _id, ruta_id } = await request.json();
   const cookieStore = cookies();
   const token: any = (await cookieStore).get(jwtName as any);
  
  try {
     jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
    const findNumero = await horarios.findOne({ nombre });
    if (findNumero && findNumero._id.toString() != _id) {
      return NextResponse.json(
        { error: "Ya existe un fiscalhorariocon este número" },
        { status: 401 }
      );
    }
    const updatedUnidad = await horarios.findOneAndUpdate(
      { _id },
      { nombre, horas, ruta_id },  
    );
    if (!updatedUnidad) {
      return NextResponse.json(
        { error: "No se encuentra ningún horario con ese ID" },
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
  const { _id } = await request.json();
   const cookieStore = cookies();
   const token: any = (await cookieStore).get(jwtName as any);
  try {
     jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
    const deletedUnidad = await horarios.findByIdAndDelete(_id);
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
