import { connect } from "@/db/dbConfig";
import LeaveAttendence from "@/models/leaveAttendenceModel";
import { NextResponse } from "next/server";

connect();

export async function GET(req) {
  try {
    const leaveData = await LeaveAttendence.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          startTime: 1,
          endTime: 1,
          leaveType: 1,
          reason: 1,
          isRejected : 1,
          isApproved : 1,
          userDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);
    return NextResponse.json(leaveData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
