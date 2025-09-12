// const jwt = require('jsonwebtoken');

// module.exports = function(req,res,next){
//   const header = req.header('Authorization');
//   console.log("👉 Authorization header:", header);


//   // console.log(header);
//   // console.log(header.split (' ')[1]);
  
  
//   const token = header && header.startsWith('Bearer') ? header.split (' ')[1]:null;

//   if(!token) return res.status(401).json({msg:'No token, authorization denied'});

//   console.log(token);
  

//   try {
//     const decoded = jwt.verify(token,process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   }catch(err){
//     return res.status(401).json({msg:'Invalid token'});
//   }
// }const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization");

  console.log("👉 Authorization header:", header);

  // ✅ Handle missing/invalid header safely
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = header.split(" ")[1];
  console.log("👉 Extracted token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("👉 Decoded JWT payload:", decoded);
    
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

