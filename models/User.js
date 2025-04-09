const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Used to hash passwords

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"], // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length of password
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Only 'user' or 'admin' roles are allowed
      default: "user", // Default role is 'user'
    },
    studyGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyGroup", // This connects the user to study groups they are part of
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash the user's password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if the password is modified

  // Hash the password using bcryptjs
  this.password = await bcrypt.hash(this.password, 10); // 10 is the number of salt rounds

  next(); // Proceed with saving the user
});

// Method to compare entered password with the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the stored hashed password
};

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
