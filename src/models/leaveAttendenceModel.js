import mongoose from "mongoose";
const { Schema } = mongoose;

const leaveAttendenceSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  leaveType: {
    type: String,
  },
  reason: {
    type: String,
  },
});

const LeaveAttendence =
  mongoose.models.leaveAttendences ||
  mongoose.model("leaveAttendences", leaveAttendenceSchema);

export default LeaveAttendence;
