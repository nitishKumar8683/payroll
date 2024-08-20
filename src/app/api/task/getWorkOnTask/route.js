import { connect } from "@/db/dbConfig";
import TaskWork from "@/models/taskWorkModel";
import Task from "@/models/assignTaskModel"; // Import Task model
import User from "@/models/userModel";  // Import User model
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

        // Fetch work logs
        const workLogs = await TaskWork.find({ userId: userIdObj });

        // Fetch tasks
        const taskIds = [...new Set(workLogs.map(log => log.taskId.toString()))];
        const tasks = await Task.find({ _id: { $in: taskIds } });
        const taskMap = tasks.reduce((map, task) => {
            map[task._id.toString()] = task;
            return map;
        }, {});

        // Combine work logs with task data
        const enrichedWorkLogs = workLogs.map(log => ({
            ...log.toObject(),
            task: taskMap[log.taskId.toString()] || {}
        }));

        return NextResponse.json(enrichedWorkLogs, { status: 200 });
    } catch (error) {
        console.error("Error fetching work logs:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
