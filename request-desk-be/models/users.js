import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModel = new Schema({
  role: { type: String, enum: ["user", "admin"] },
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String, minlength: 6, required: true },
    createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("User", UserModel);
