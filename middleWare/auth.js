const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
  const header = req.header('Authorization');

  console.log(header);
  console.log(header.split (' ')[1]);
  
  
  const token = header && header.startsWith('Bearer') ? header.split (' ')[1]:null;

  if(!token) return res.status(401).json({msg:'No token, authorization denied'});

  console.log(token);
  

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  }catch(err){
    return res.status(401).json({msg:'Invalid token'});
  }
}