import { connect } from "@/db/dbConfig";
import Task from "@/models/assignTaskModel";
import { NextResponse } from "next/server";

connect();

export async function POST(req, res) {
    try {
        const reqBody = await req.json();
        const { taskName, taskDescription, dueDate, assignedBucket } = reqBody
        console.log(taskName)

        const newTask = await Task.create({
            taskName,
            taskDescription,
            dueDate,
            assignedBucket,
            status: "pending",
            completedAt: null
        });

        console.log(newTask)

        return NextResponse.json({ success: true, newTask });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
