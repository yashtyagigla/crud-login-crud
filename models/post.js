const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:{ type: String, required: true },
  content:{ type: String, required: true }, 
  isPublic:{type:Boolean, default:false},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required: true}
},{timestamps: true});

module.exports = mongoose.model('Post',postSchema);
