const Post = require('../models/post');

exports.createPost = async (req, res) => {
  try {
    const { title, content, isPublic, imageUrl} = req.body;
    if (!title || !content) return res.status(400).json({ msg: "Title and content required" });

    // const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      title,
      content,
      isPublic: isPublic === "true" || isPublic === true,
      imageUrl,
      user: req.userId
    });

    return res.status(201).json({ msg: "Post created", post });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.getMyPosts = async (req,res)=>{
const posts = await Post.find({user:req.userId}).populate('user','name _id').sort({createdAt:-1});
  return res.json({posts});
};

exports.getPostById = async(req,res)=>{

  const post = await Post.findOne({_id:req.params.id});
  if(!post) return res.status(404).json({msg:'Post not found'});
  return res.json(post);
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    const updateData = {
      title,
      content,
      isPublic: isPublic === "true" || isPublic === true
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: updateData },
      { new: true }
    );

    if (!post) return res.status(404).json({ msg: "Post not found or not yours" });
    return res.json(post);
  } catch (e) {
    console.error("❌ Update error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
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

// Like Post
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Ensure likes/dislikes are arrays
    if (!Array.isArray(post.likes)) post.likes = [];
    if (!Array.isArray(post.dislikes)) post.dislikes = [];

    const userId = req.userId;

    // If already liked, remove like
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Add like and remove dislike if exists
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId.toString());
    }

    await post.save();

    return res.json({
      msg: "Post like toggled",
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (err) {
    console.error("❌ toggleLikePost error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};

// Dislike Post
exports.toggleDislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Ensure arrays exist
    if (!Array.isArray(post.likes)) post.likes = [];
    if (!Array.isArray(post.dislikes)) post.dislikes = [];

    const userId = req.userId;

    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    }

    await post.save();

    return res.json({
      msg: "Post dislike toggled",
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (err) {
    console.error("❌ toggleDislikePost error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};