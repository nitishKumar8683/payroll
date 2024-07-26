import mongoose from "mongoose";
const { Schema } = mongoose;

const attendenceSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
    default: null,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Attendence =
  mongoose.models.attendences ||
  mongoose.model("attendences", attendenceSchema);

export default Attendence;
