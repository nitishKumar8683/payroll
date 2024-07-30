import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

connect();

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    const userId = decodedToken.id;
    console.log(userId);
    const usersData = await User.find({
      _id: { $ne: userId },
      isDelete: { $ne: "1" },
    }).select("-password");

    if (!usersData || usersData.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Users data retrieved successfully",
      usersData,
    });
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
