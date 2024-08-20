import { connect } from "@/db/dbConfig";
import TaskWork from "@/models/taskWorkModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

connect();

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        console.error("Token verification error:", error);
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
        const userIdObj = new ObjectId(userId);

        const workLogs = await TaskWork.find({ userId: userIdObj });

        return NextResponse.json(workLogs, { status: 200 });
    } catch (error) {
        console.error("Error fetching work logs:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
