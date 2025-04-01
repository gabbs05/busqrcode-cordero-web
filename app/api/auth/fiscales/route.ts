import { NextResponse } from "next/server";
import { Secret, sign } from "jsonwebtoken";
import { connectDB } from "@/libs/db";
import fiscales from "@/models/fiscales";
import bcrypt from "bcryptjs";

export async function POST(request: any) {
  connectDB();
  try {
    const {username, password} = await request.json();
    console.log(username,password);
    const admins = await fiscales.findOne({ username: username });
    if (
      admins.length == 0 ||
      !(await bcrypt.compare(password, admins.password))
    ) {
        console.log('Invalid credentials');
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    } else {
      const response = admins;
      console.log(response);
      return NextResponse.json(response);
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json((error as Error).message, {
      status: 400,
    });
  }
}

export async function GET(request: any) {
    connectDB();
    const fisc = await fiscales.find();
   return NextResponse.json(fisc);
}
