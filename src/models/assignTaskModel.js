import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new mongoose.Schema({
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    taskName: {
        type: String,
    },
    taskDescription: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    assignedBucket: {
        type: String,
    },
    
    status: {
        type: String,
        enum: ['pending', 'inprogress', 'completed'],
        default: 'pending',
    },
    completedAt : {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.models.tasks || mongoose.model("tasks", taskSchema);

export default Task;
