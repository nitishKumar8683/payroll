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

export async function POST(request) {
    try {
        // Extract token from cookies
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify and decode the token
        const decodedToken = verifyToken(token);
        const userId = decodedToken.id;
        const userIdObj = new ObjectId(userId);

        // Extract data from the request body
        const { taskId, workDuration } = await request.json();

        if (!taskId || workDuration === undefined || workDuration < 0) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Create a new work log entry
        const newWorkLog = new TaskWork({
            userId: userIdObj,
            taskId: new ObjectId(taskId),
            workDuration,
        });

        // Save the new work log entry to the database
        await newWorkLog.save();

        return NextResponse.json({ message: "Work duration saved successfully", workLog: newWorkLog }, { status: 200 });
    } catch (error) {
        console.error("Error saving work duration:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
