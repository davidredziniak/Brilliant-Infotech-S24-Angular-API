import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define structure
export interface UserInter extends Document {
  username: string;
  password: string;
  comparePassword(pass: string): Promise<boolean>;
}

// Define database schema of a User
const dataSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

// Salt + Hashes password when saving a new user in the DB
dataSchema.pre<UserInter>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method for comparing passwords in the DB
dataSchema.methods.comparePassword = async function (
  pass: string
): Promise<boolean> {
  return bcrypt.compare(pass, this.password);
};

export default mongoose.model<UserInter>("User", dataSchema, "users");
