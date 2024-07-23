import { UploadImage } from "@/helpers/upload-image";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";

connect();


export const GET = async (req: NextRequest, { params }: any) => {
  const id = params.id;
  console.log(id);

  try {
    const user = await User.findById(id);
    console.log(user);

    if (!user) {
      return NextResponse.json({
        error: "User not found",
        status: 404,
      });
    }
    //const images = user.images; 

    return NextResponse.json({
      images: user,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user or images:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      status: 500,
    });
  }
};

export const POST = async (req: NextRequest ,  {params} : any) => {
   const id = params.id;
   console.log(id);
  const formData = await req.formData();
  const image = formData.get("image") as unknown as File;
  const data: any = await UploadImage(image, "next-js-payroll");
  console.log(data);

  const updateMe = await User.findByIdAndUpdate(id, {
    image_url: data?.secure_url,
    public_id: data?.public_id,
  });
  return NextResponse.json({
    msg: updateMe,
    status: 200,
  });
};
