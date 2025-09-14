const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();




const isLogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/admin/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("before login data", req.user);
    req.user = decoded;
    console.log("afetr login data", req.user);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  return next();
};


module.exports ={ isLogin };
