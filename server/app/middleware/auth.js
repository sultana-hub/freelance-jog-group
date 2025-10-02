


const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const httpStatusCode = require('../helper/httpStatusCode');


const hashedPassword=(password)=>{
    const salt =10;
    const hash = bcryptjs.hashSync(password, salt);
    return hash

}

const comparePassword=(password,hashedPassword)=>{

    return bcryptjs.compareSync(password,hashedPassword)

}


const AuthCheck=(req,res,next)=>{
    const token=req?.body?.token||req?.headers['x-access-token']
    if(!token){
        return res.status(httpStatusCode.BadRequest).json({
                    status:false,
                    message:"please login first to access this apge"
                })
    }
    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decoded
    }catch(error){
        return res.status(httpStatusCode.NotFound).json({
                    status:false,
                    message:"invalid token access"
                })
    }
    next()

}

const isAdmin = (req, res, next) => {
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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access forbidden: insufficient role' });
    }
    next();
  };


module.exports={hashedPassword,comparePassword,AuthCheck , isAdmin}