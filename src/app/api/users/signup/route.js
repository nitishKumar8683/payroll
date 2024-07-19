import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypts from "bcryptjs";
import { connect } from "@/db/dbConfig";

connect()

export async function POST(request) {
    try {
        const reqData = await request.json();
        const { name, email, password, confirm_password, role } =
          reqData;

        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return NextResponse.json({
                message: "User Already exists",
                success: false,
            });
        }

        if (password != confirm_password) {
            return NextResponse.json({
                message: "Password Don't match",
                success: false,
            });
        }

        const salt = await bcrypts.genSalt(10);
        const hashPassword = await bcrypts.hash(password, salt);

        const newUser = new User({
          name,
          email,
          password: hashPassword,
          role,
          isDelete : "",
        });

        const saveUser = await newUser.save();
        console.log(saveUser);
        if (saveUser) {
            return NextResponse.json({
                message: "User created successfully...",
                success: true,
                saveUser,
            });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
