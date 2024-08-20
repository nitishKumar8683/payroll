import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    workDuration: { type: Number, required: true },
}, { timestamps: true }); 

const TaskWork = mongoose.models.workstask || mongoose.model("workstask", workLogSchema);

export default TaskWork;
