import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    candidateId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    email: { type: String, required: true },
    stage: {
      type: String,
      default: "Applied",
    },
    score: { type: Number, default: 80 },
    experienceYears: { type: Number, default: 3 },
    education: { type: String, default: "B.S. Computer Science" },
    skills: [{ type: String }],
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    summary: { type: String },
    resumeFileName: { type: String },
    interview: {
      date: String,
      time: String,
      meetUrl: String,
      status: String,
    },
    interviewFeedback: {
      technicalRating: Number,
      communicationRating: Number,
      notes: String,
      verdict: String,
    },
    history: [
      {
        stage: String,
        date: String,
        updatedBy: String,
      },
    ],
    appliedDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
);

candidateSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret.candidateId || ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

const jobSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    title: { type: String, required: true },
    company: { type: String, default: "Atlas Technologies" },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, default: "Full-Time" },
    level: { type: String, default: "Mid-Senior" },
    salaryRange: { type: String, default: "$120,000 - $150,000" },
    salary: { type: String, default: "$120,000 - $150,000" },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    status: {
      type: String,
      enum: ["Draft", "Published", "Paused", "Closed"],
      default: "Published",
    },
    candidates: [candidateSchema],
    createdBy: { type: String, default: "Recruitment Team" },
  },
  { timestamps: true }
);

jobSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret.id || ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Job = mongoose.model("Job", jobSchema);
