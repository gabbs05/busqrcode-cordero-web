import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import { NextResponse } from "next/server";

connectDB();

export async function DELETE(
  request: Request,
  { params }: { params: { delet: string } }
) {
  const { delet } = params;
  console.log("delet:", delet);

  try {
    // eliminar el registro
    await timestamps.findByIdAndDelete(delet);
    return NextResponse.json(
      { message: "Firma eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
