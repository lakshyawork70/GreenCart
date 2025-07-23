import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

//Register User  #/api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (name.length < 2) {
      return res.json({
        success: false,
        message: "Name should be at least 2 characters",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 8 })) {
      return res.json({ success: false, message: "Password too short" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true, //Prevent JS to access cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 1000, //Coookie expiration time
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      message: "User Registered Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Login User #/api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email & Password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 8 })) {
      return res.json({ success: false, message: "Password too short" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true, //Prevent JS to access cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 1000, //Coookie expiration time
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      message: "User Logged In Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Check Auth : #/api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Logout User : #/api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, //Prevent JS to access cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


