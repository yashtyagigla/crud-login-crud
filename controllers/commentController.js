const Comment = require("../models/comment");

// Add a new comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text required" });

    const newComment = new Comment({
      text,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      user: req.userId,
      post: req.params.postId
    });

    await newComment.save();
    return res.status(201).json(newComment);
  } catch (err) {
    console.error("❌ Comment create error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name _id")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (err) {
    console.error("❌ Fetch comments error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.params.id })
      .populate("post", "title _id")   // also show which post they commented on
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all comments made by a specific user
exports.getCommentsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const comments = await Comment.find({ user: userId })
      .populate("post", "title _id") // populate the post's title and id
      .populate("user", "name _id")  // populate user details
      .sort({ createdAt: -1 });      // latest first

    if (!comments.length) {
      return res.status(404).json({ msg: "No comments found for this user" });
    }

    return res.json(comments);
  } catch (err) {
    console.error("❌ getCommentsByUser error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};

// Toggle like on a comment
exports.toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // If user already liked, remove like
    if (comment.likes.includes(req.userId)) {
      comment.likes.pull(req.userId);
    } else {
      comment.likes.push(req.userId);
      comment.dislikes.pull(req.userId); // remove dislike if exists
    }

    await comment.save();
    return res.json({ likes: comment.likes.length, dislikes: comment.dislikes.length });
  } catch (err) {
    console.error("❌ Toggle like error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};

// Toggle dislike on a comment
exports.toggleDislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // If user already disliked, remove dislike
    if (comment.dislikes.includes(req.userId)) {
      comment.dislikes.pull(req.userId);
    } else {
      comment.dislikes.push(req.userId);
      comment.likes.pull(req.userId); // remove like if exists
    }

    await comment.save();
    return res.json({ likes: comment.likes.length, dislikes: comment.dislikes.length });
  } catch (err) {
    console.error("❌ Toggle dislike error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
};