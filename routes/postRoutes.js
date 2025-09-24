const express = require("express");
const auth = require("../middleWare/auth");
const upload = require("../middleWare/upload");
const {
  createPost,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  getPublicPosts,
  getUserPublicPosts,
  toggleLikePost,
  toggleDislikePost,
  getMyPrivatePosts
} = require("../controllers/postController");

const router = express.Router();

// Create & Update posts
router.post("/", auth, upload.single("image"), createPost);
router.put("/:id", auth, upload.single("image"), updatePost);

// Delete a post
router.delete("/:id", auth, deletePost);

// Get posts for logged-in user
router.get("/", auth, getMyPosts);
// router.get("/private/mine", auth, getMyPrivatePosts); // 👈 your private posts

// Public post routes
router.get("/post/public", getPublicPosts);
router.get("/user/:id", getUserPublicPosts);

// Get single post by id (keep dynamic route at bottom)
router.get("/:id", auth, getPostById);

// Like/Dislike
router.post("/:id/like", auth, toggleLikePost);
router.post("/:id/dislike", auth, toggleDislikePost);

module.exports = router;