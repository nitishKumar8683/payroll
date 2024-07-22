import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

connect();

export async function GET(request, { params }) {
  const userId = params.id;

  try {
    const getUserById = await User.findById({ _id: userId }).select(
      "-password",
    );

    if (!getUserById) {
      return NextResponse.json({ message: "User not found" });
    }

    const dataResponse = NextResponse.json({
      message: "Data Successfull get",
      getUserById,
    });

    return dataResponse;
  } catch (err) {
    console.error("Error Fetch bY Id User:", err);
    return NextResponse.json(
      { message: "Failed to Fetch User" },
      { status: 500 },
    );
  }
}
