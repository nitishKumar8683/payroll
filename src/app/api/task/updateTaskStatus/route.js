import { connect } from "@/db/dbConfig";
import Task from "@/models/assignTaskModel";
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

export async function PUT(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = verifyToken(token);
        const userId = decodedToken.id;
        const userIdObj = new ObjectId(userId);

        const { taskId, newStatus } = await request.json();

        if (!taskId || !newStatus) {
            return NextResponse.json({ error: "Missing taskId or newStatus" }, { status: 400 });
        }
        const validStatuses = ['pending', 'inprogress', 'completed'];
        if (!validStatuses.includes(newStatus)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        const task = await Task.findOne({ _id: new ObjectId(taskId), assignedUser: userIdObj });

        if (!task) {
            return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 });
        }

        task.status = newStatus;

        if (newStatus === 'completed') {
            task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }

        await task.save();

        return NextResponse.json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Error updating task" }, { status: 500 });
    }
}
