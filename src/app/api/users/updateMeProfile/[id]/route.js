import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

connect();

export async function PUT(request, { params }) {
  const id = params.id;
  console.log(id);
  const reqBody = await request.json();
  const  phoneNumber  = reqBody;
  console.log(phoneNumber);
  try {
    const updateMe = await User.findByIdAndUpdate(id, {
      phoneNumber,
    });

    if (!updateMe) {
      return NextResponse.json({ message: "User not found..." });
    }

    const dataResponse = NextResponse.json({
      message: "Updated Successfull",
      updateMe,
    });
    return dataResponse;
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
