import mongoose from "mongoose";

const standaloneCandidateSchema = new mongoose.Schema(
  {
    candidateId: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
    jobId: { type: String, required: true, index: true },
    jobTitle: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    stage: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "HR Review", "Interview Scheduled", "Interview Completed", "Selected", "Rejected", "Hired"],
      default: "Applied",
    },
    score: { type: Number, default: 85 },
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

standaloneCandidateSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret.candidateId || ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Candidate = mongoose.model("Candidate", standaloneCandidateSchema);
