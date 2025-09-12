const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req,res) =>{
  try{
    const {name,email,password} = req.body;
    if(!name || !email || !password ) return res.status(400).json({msg:'All field required'});

    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({msg:'User already exists'});

    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({name,email,password:hashed});

    return res.status(201).json({msg:"Registered successfully", user:{id: user._id,name, email}});
  }catch(e){
    return res.status(500).json({msg:e.message});
  }
};

exports.login = async(req,res)=>{
  try{
    const {email,password} = req.body;

    if(!email || !password ) return res.status(400).json({msg:'All field required'});
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:'Invalid credentials'});

    const ok = await bcrypt.compare(password,user.password);
    if(!ok) return res. status(400).json({msg:'Invalid credentials'});

    console.log({id:user._id}, process.env.JWT_SECRET,{ expiresIn:"12h"});
    // console.log(user._id);
    
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{ expiresIn:"12h"});
    console.log(token);
    

    return res.json({token,user:{id:user._id, name:user.name,email:user.email}});
  }catch(e){
    return res.status(500).json({msg:e.message});
  }
};