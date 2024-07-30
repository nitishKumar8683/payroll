import { connect } from "@/db/dbConfig";
import LeaveAttendence from "@/models/leaveAttendenceModel";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const reqBody = await request.json();
    const { isApproved, isRejected } = reqBody;

    if (typeof isApproved !== "boolean" || typeof isRejected !== "boolean") {
      return NextResponse.json({
        message: "Invalid input data",
        status: false,
      });
    }

    const updatedLeaveAttendence = await LeaveAttendence.findByIdAndUpdate(
      id,
      { isApproved, isRejected },
      { new: true, runValidators: true },
    );

    if (!updatedLeaveAttendence) {
      return NextResponse.json({
        message: "Leave Attendance not found",
        status: false,
      });
    }

    return NextResponse.json({
      updatedLeaveAttendence,
      message: "Leave Attendance updated successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error updating leave attendance:", error);
    return NextResponse.json({
      message: "Error updating leave attendance",
      status: false,
    });
  }
}
