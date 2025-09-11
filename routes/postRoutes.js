const express  = require('express');
const auth = require('../middleWare/auth');
const {createPost,getMyPosts,getPostById,updatePost,deletePost,getPublicPosts,getUserPublicPosts} = require('../controllers/postController');

const router =express.Router();


router.post('/',auth,createPost);
router.get('/',auth, getMyPosts);
router.get('/:id', auth, getPostById);
router.put('/:id',auth,updatePost);
router.delete('/:id',auth, deletePost);
router.get("/post/public", getPublicPosts);
router.get("/user/:id", getUserPublicPosts);

module.exports = router;