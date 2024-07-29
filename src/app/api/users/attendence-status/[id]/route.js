import Attendence from "@/models/attendenceModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params.id;

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const attendance = await Attendence.findOne({
      userId: id,
      startTime: {
        $gte: todayStart.toISOString(),
        $lt: todayEnd.toISOString(),
      },
    });

    if (attendance) {
      return NextResponse.json({
        isStarted: true,
        startTime: attendance.startTime,
        endTime: attendance.endTime || null,
      });
    }

    return NextResponse.json({
      isStarted: false,
    });
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    return NextResponse.json({
      message: "An error occurred",
      status: false,
    });
  }
}
