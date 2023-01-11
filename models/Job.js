const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please enter a company name"],
    },
    position: {
      type: String,
      required: [true, "Please enter position"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "interview", "declined"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
