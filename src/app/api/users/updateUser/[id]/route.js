import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

connect();

export async function PUT(request, { params }) {
  const id = params.id;
  console.log(id);
  const reqBody = await request.json();
  const { name, email, role } = reqBody;
  console.log(reqBody);

  // const emailExting = await User.findOne({ email: email });
  // if (emailExting) {
  //   return NextResponse.json({ message: "Email Already exists..." , success : false});
  // } else {
    try {
      const updatedBook = await User.findByIdAndUpdate(id, {
        name,
        email,
        role,
      });

      if (!updatedBook) {
        return NextResponse.json({ message: "User not found..." });
      }

      const dataResponse = NextResponse.json({
        message: "Updated Successfull",
        updatedBook,
      });
      return dataResponse;
    } catch (error) {
      return NextResponse.json({ error: error.message });
    }
  // }
}
