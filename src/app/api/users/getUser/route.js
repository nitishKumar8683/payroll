import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Accept");

  try {
    const usersData = await User.find({
      role: { $ne: "admin" },
      isDelete: { $ne: "1" },
    }).select("-password");
    console.log(usersData);
    return NextResponse.json({
      message: "User Retrieve Successfully",
      success: true,
      usersData,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
