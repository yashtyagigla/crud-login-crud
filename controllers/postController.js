const Post = require('../models/post');

exports.createPost = async(req,res) =>{
  try{
    console.log("Request body:", req.body); 
    const {title, content, isPublic, imageUrl} = req.body;
    if(!title || !content) return res.status(400).json({msg:"Title and content required"});

    const post =  await Post.create({title,content,isPublic: isPublic === true || isPublic === "true",
    imageUrl,
    user:req.userId});
    return res.status(201).json({msg:'Post created',post});
  }catch(e){
    return res.status(500).json({msg:e.message});
  }
};

exports.getMyPosts = async (req,res)=>{
const posts = await Post.find({user:req.userId}).populate('user','name _id').sort({createdAt:-1});
  return res.json({posts});
};

exports.getPostById = async(req,res)=>{

  const post = await post.findOne({_id:req.params.id});
  if(!post) return res.status(404).json({msg:'Post not found'});
  return res.json(post);
};

exports.updatePost = async (req,res)=>{
  const post = await Post.findOneAndUpdate(
    {_id:req.params.id, user:req.userId},
    { $set: { title, content, isPublic, imageUrl } },
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

// Get all public posts
exports.getPublicPosts = async (req, res) => {
  console.log("Fetching public posts");
  
  const posts = await Post.find({ isPublic: true })
    .populate("user", "name _id")
    .sort({ createdAt: -1 });
  return res.json(posts);
};

// Get public posts by specific user
exports.getUserPublicPosts = async (req, res) => {
  const posts = await Post.find({ user: req.params.id, isPublic: true })
    .populate("user", "name _id")
    .sort({ createdAt: -1 });

  if (!posts.length) return res.status(404).json({ msg: "No public posts found for this user" });

  return res.json(posts);
};