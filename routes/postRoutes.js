const express  = require('express');
const auth = require('../middleWare/auth');
const upload = require("../middleWare/upload");
const {createPost,getMyPosts,getPostById,updatePost,deletePost,getPublicPosts,getUserPublicPosts} = require('../controllers/postController');

const router =express.Router();

router.post("/", auth, upload.single("image"), createPost);
router.put("/:id", auth, upload.single("image"), updatePost);
// router.post('/',auth,createPost);
router.get('/',auth, getMyPosts);
router.get('/:id', auth, getPostById);
// router.put('/:id',auth,updatePost);
router.delete('/:id',auth, deletePost);
router.get("/post/public", getPublicPosts);
router.get("/user/:id", getUserPublicPosts);


module.exports = router;