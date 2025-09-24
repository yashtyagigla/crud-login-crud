const express = require("express");
const auth = require("../middleWare/auth");
const upload = require("../middleWare/upload");
const {
  addComment,
  getComments,
  toggleLikeComment,
  toggleDislikeComment
} = require("../controllers/commentController");

const router = express.Router();

// Add & Get comments
router.post("/:postId", auth, upload.single("image"), addComment);
router.get("/:postId", getComments);
router.get("/user/:id", getUserComments);

// Get all comments by a specific user
router.get("/user/:id", getCommentsByUser);

// Like/Dislike comments
router.post("/:id/like", auth, toggleLikeComment);
router.post("/:id/dislike", auth, toggleDislikeComment);

module.exports = router;