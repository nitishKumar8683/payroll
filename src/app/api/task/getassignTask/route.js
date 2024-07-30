import { connect } from "@/db/dbConfig";
import Task from "@/models/assignTaskModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

connect();

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded;
    } catch (error) {
        console.error("Token verification error:", error);
        throw new Error("Invalid token");
    }
};

export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;
        console.log("Token from cookies:", token);

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = verifyToken(token);
        const userId = decodedToken.id;
        const userIdObj = new ObjectId(userId);
        const leaveData = await Task.aggregate([
            { $match: { assignedUser: userIdObj } },
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
                    userDetails: { _id: 1, name: 1, email: 1 },
                },
            },
        ]);
        return NextResponse.json(leaveData);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}
