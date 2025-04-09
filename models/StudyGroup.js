const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures the group name is unique
      index: true,  // Optional: add an index for faster querying on the name
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This references the User model
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This references the User model for members
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model for admins
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Optional: Before saving, ensure that there is at least one admin in the admins array
studyGroupSchema.pre("save", function (next) {
  if (this.admins.length === 0) {
    return next(new Error("At least one admin is required for a study group."));
  }
  next();
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
