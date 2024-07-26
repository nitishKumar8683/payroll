// pages/api/attendance.js
import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import Attendence from "@/models/attendenceModel";
import { NextResponse } from "next/server";

connect();

export async function GET(req) {
  try {
    // Perform the aggregation
    const data = await Attendence.aggregate([
      {
        $lookup: {
          from: "users", // collection name in MongoDB
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
          time: 1,
          userDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
