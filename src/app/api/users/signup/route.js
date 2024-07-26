import bcrypt from "bcryptjs";
import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import mailSender from "@/helpers/mailSender";
import emailTemplate from "@/helpers/template/emailTemplate";
import otpgnerator from "otp-generator";

connect();

export async function POST(request) {
  try {
    const reqData = await request.json();
    const { name, email, role } = reqData;

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        message: "Email already exists",
        status: 400,
        success: false,
      });
    }

    const password = otpgnerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // const password = "hello";

    // try {
    //   const emailResponse = await mailSender(
    //     email,
    //     "Your Account Information",
    //     emailTemplate(email, password),
    //   );
    //   console.log("Email sent successfully:", emailResponse.response);
    // } catch (error) {
    //   console.error("Error occurred while sending email:", error);
    //   return NextResponse.json({
    //     success: false,
    //     message: "Error occurred while sending email",
    //     error: error.message,
    //   });
    // }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      isDelete: "",
      phoneNumber: "",
      image_url: "",
      public_id: "",
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
    return NextResponse.json({
      message: "User created successfully",
      savedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
