import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const usersData = await User.find({ role: { $ne: "admin" } , isDelete : {$ne : "1"} }).select(
      "-password",
    );
    console.log(usersData);
    return NextResponse.json({
      message: "User Reterive Successfully",
      success: true,
      usersData,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
