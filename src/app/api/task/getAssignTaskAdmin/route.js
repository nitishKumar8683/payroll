import { connect } from "@/db/dbConfig";
import Task from "@/models/assignTaskModel";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
    try {
        const adminTaskDetail = await Task.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "assignedUser",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    taskName: 1,
                    taskDescription: 1,
                    dueDate: 1,
                    status :1,
                    createdAt: 1,
                    completedAt: 1,
                    userDetails: { _id: 1, name: 1, email: 1 },
                },
            },
        ]);
        return NextResponse.json(adminTaskDetail);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}
