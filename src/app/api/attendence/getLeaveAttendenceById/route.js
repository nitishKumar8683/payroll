import { connect } from "@/db/dbConfig";
import LeaveAttendence from "@/models/leaveAttendenceModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

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
        console.log("Token from cookies:", token);

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = verifyToken(token);
        const userId = decodedToken.id;
        console.log("Decoded Token:", decodedToken);
        console.log("User ID:", userId);

        const userIdObj = new ObjectId(userId);

        const leaveData = await LeaveAttendence.aggregate([
            { $match: { userId: userIdObj } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    startTime: 1,
                    endTime: 1,
                    leaveType: 1,
                    reason: 1,
                    isRejected: 1,
                    isApproved: 1,
                    userDetails: { _id: 1, name: 1, email: 1 },
                },
            },
        ]);

        console.log("Aggregation Pipeline Result:", leaveData);

        return NextResponse.json(leaveData);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}
