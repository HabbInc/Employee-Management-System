import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectTitle: { type: String, required: true },
    department: { type: String, required: true },
    projectPriority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    clientName: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    assignedEmployees: [
      {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        role: { type: String }, // Developer, Designer, Manager
        assignedDate: { type: Date, default: Date.now },
      },
    ],
    workStatus: { type: String, enum: ["Pending", "In Progress", "Completed", "On Hold", "Canceled"], default: "Pending" },
    progress: { type: Number, default: 0 }, // Percentage completed
    description: { type: String },
    image: { type: String },
  

}, { timestamps: true });

const ProjectModel =mongoose.models.project || mongoose.model("project",ProjectSchema)

export default ProjectModel

