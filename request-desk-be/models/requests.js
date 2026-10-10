import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RequestModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String },
  category: { type: String },
  submittedBy: { type: String },
  status: { type: String },
  priority: { type: String },
  name: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model("Request", RequestModel);
