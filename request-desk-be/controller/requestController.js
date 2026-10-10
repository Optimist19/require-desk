import Request from "../models/requests.js";

export async function addRequest(req, res) {
  const { title, category, submittedBy, status, priority, name, userId } =
    req.body;

  if (
    title === "" ||
    category === "" ||
    priority === "" ||
    submittedBy === "" ||
    status === "" ||
    userId === "" ||
    name === ""
  ) {
    return res.status(400).json({ message: "All inputs are requited" });
  }

  try {
    const data = await Request({
      title,
      category,
      submittedBy,
      status,
      priority,
      name,
      userId
    });
    const savedTask = await data.save();
    return res.status(201).json({ message: "Successful", savedTask });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getRequests(req, res) {
  try {
    const data = await Request.find();
    return res.status(200).json({ message: "Successful", data });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateRequest(req, res) {
  const { status } = req.body;
  const id = req.params.id;

  if (!["Open", "In progress", "Resolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid request status" });
  }

  try {
    const updatedData = await Request.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" } // {new: true} is outdated in new mongoose version, so that is what is what is used instead, if the value is false, you use before instead.
    );
    if (!updatedData) {
      return res.status(404).json({ message: "Request not found" });
    }
    return res.status(200).json({ message: "Success", updatedData });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
