import Attendence from "@/models/attendenceModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const id = params.id;

  try {
    const reqBody = await req.json();
    const { startTime } = reqBody;

    if (typeof startTime !== "string") {
      return NextResponse.json({
        message: "Invalid startTime format",
        status: false,
      });
    }

    const startTimeDate = new Date(startTime);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const existingAttendance = await Attendence.findOne({
      userId: id,
      startTime: {
        $gte: todayStart.toISOString(),
        $lt: todayEnd.toISOString(),
      },
    });

    if (existingAttendance) {
      return NextResponse.json({
        message: "Attendance already recorded for today",
        status: false,
      });
    }

    const newAttendence = new Attendence({
      userId: id,
      startTime: startTimeDate.toISOString(),
      endTime: "", // Ensure this is an empty string or null
    });

    const savedAttendence = await newAttendence.save();
    return NextResponse.json({
      savedAttendence,
      message: "Attendance started",
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
