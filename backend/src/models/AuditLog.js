import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String, required: true },
    timestamp: {
      type: String,
      default: () => new Date().toISOString().replace("T", " ").slice(0, 19),
    },
  },
  { timestamps: true }
);

auditLogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
