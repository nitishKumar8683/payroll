import LeaveAttendence from "@/models/leaveAttendenceModel";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    const id = params.id;

    try {
        const reqBody = await request.json();
        const { startTime, endTime, leaveType, reason } = reqBody;
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({
                message: "Invalid date-time format",
                status: false,
            });
        }

        const newLeaveAttendence = new LeaveAttendence({
            userId: id,
            startTime: start,
            endTime: end,
            leaveType,
            reason,
        });
        const savedLeaveAttendence = await newLeaveAttendence.save();

        return NextResponse.json({
            savedLeaveAttendence,
            message: "Leave Attendance Saved",
            status: true,
        });
    } catch (error) {
        console.error("Error saving leave attendance:", error);
        return NextResponse.json({
            message: "Error saving leave attendance",
            status: false,
        });
    }
}
