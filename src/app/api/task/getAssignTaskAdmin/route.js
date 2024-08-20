import { connect } from "@/db/dbConfig";
import Task from "@/models/assignTaskModel";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
    try {
        // Fetch all tasks from the Task collection
        const tasks = await Task.find({})
            .select({
                _id: 1,
                taskName: 1,
                taskDescription: 1,
                dueDate: 1,
                status: 1,
                createdAt: 1,
                completedAt: 1
            });

        console.log("Tasks fetched:", tasks);

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
    }
}
