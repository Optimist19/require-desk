import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { role, email, password, name } = req.body;

  if (!role || !email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User({ role, email, password: hashedPassword, name });
    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    // First, check whether the user exists
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Only compare passwords if the user exists
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      accessToken,
      user: {
        user_id: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error"
    });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token"
    });
  }
}
