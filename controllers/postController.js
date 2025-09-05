const Post =require('../models/Post');

exports.createPost = async(req,res) =>{
  try{
    const {title,content} = req.body;
    if(!title || !content) return res.status(400).json({msg:"Title and content required"});

    const post =  await Post.create({title,content,user:req.userId});
    return res.status(201).json({msg:'Post created',post});
  }catch(e){
    return res.status(500).json({msg:e.message});
  }
};

exports.getMyPosts = async (req,res)=>{
  const posts = await Post.find({user:req.userId}).sort({createdAt:-1});
  return res.json({posts});
};

exports.getPostById = async(req,res)=>{
  const post = await post.findOne({_id:req.userId});
  if(!post) return res.status(404).json({msg:'Post not found'});
  return res.json(post);
};

exports.updatePost = async (req,res)=>{
  const post = await Post.findOneAndUpdate(
    {_id:req.params.id, user:req.userId},
    {$set:req.body},
    {new:true}
  );
  if(!post) return res.status(404).json({msg:'Post not found or not yours'});
  return res.json(post);
};

exports.deletePost = async(req,res)=>{
  const post = await Post.findOneAndDelete({_id:req.params.id, user: req.userId });
  if(!post) return res.status(404).json({msg:'Post not found or not yours'});
  return res.json({msg:'Deleted'});
};