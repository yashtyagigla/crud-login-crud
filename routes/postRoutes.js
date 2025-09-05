const express  = require('express');
const auth = require('../middleWare/auth');
const {createPost,getMyPosts,getPostById,updatePost,deletePost} = require('../controllers/postController');

const router =express.Router();

router.post('/',auth,createPost);
router.get('/',auth, getMyPosts);
router.get('/:id', auth, getPostById);
router.put('/:id',auth,updatePost);
router.delete('/:id',auth, deletePost);

module.exports = router;