import jwt from "jsonwebtoken";

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true, //Prevent JS to access cookie
        secure: process.env.NODE_ENV === "production", //use secure cookie in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
        maxAge: 7 * 24 * 60 * 1000, //Coookie expiration time
      });
      return res.json({
        success: true,
        message: "User Logged In Successfully",
      });
    } else {
      return res.json({ success: false, message: "Invalid Credentils" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Seller Auth : #/api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//Logout Seller : #/api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true, //Prevent JS to access cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
