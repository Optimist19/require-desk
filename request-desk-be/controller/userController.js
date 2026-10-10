import User from "../models/users.js";

export async function getAllUsers(req, res) {
  try {
    const page = parseInt(req.query.p) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit).select("-password");
    if (!users) {
      return res.status(200).json({ message: "No user" });
    }

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      message: "Successful",
      paginate: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage: totalPages > page,
        hasPrevPage: page > 1
      },
      users
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getUser(req, res) {
  const { role, id } = req.user;
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const idExist = await User.findById(id).select("-password");
    if (!idExist) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Successful", idExist });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteUser(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Failed to delete user" });
  }
  try {
    const data = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Delete successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
