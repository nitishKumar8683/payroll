import Attendence from "@/models/attendenceModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const id = params.id;

  try {
    const reqBody = await req.json();
    const { endTime } = reqBody;

    if (typeof endTime !== "string") {
      return NextResponse.json({
        message: "Invalid endTime format",
        status: false,
      });
    }

    const endTimeDate = new Date(endTime);

    const attendance = await Attendence.findOneAndUpdate(
      {
        userId: id,
        $or: [{ endTime: { $exists: false } }, { endTime: "" }],
      },
      { $set: { endTime: endTimeDate.toISOString() } },
      { new: true },
    );

    if (!attendance) {
      return NextResponse.json({
        message:
          "No active attendance record found. Please ensure the record exists and has not already been closed.",
        status: false,
      });
    }

    return NextResponse.json({
      message: "Attendance ended successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      message: "An error occurred",
      status: false,
    });
  }
}
