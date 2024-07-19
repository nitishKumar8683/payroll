import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params }) {
  const userId = params.id;

  try {
    const deleteBook = await User.deleteOne({ _id: userId });

    if (deleteBook.deletedCount > 0) {
      return NextResponse.json({ message: "Delete Successful" });
    } else {
      return NextResponse.json({ message: "Book not found" });
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete book" },
      { status: 500 },
    );
  }
}
