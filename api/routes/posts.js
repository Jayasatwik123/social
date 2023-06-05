const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        await post.updateOne({$set:req.body})
        res.status(200).json("post has been updated")
    } else {
      res.status(403).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne()
            res.status(200).json("post has been deleted")
        }else{
            res.status(403).json("u can delte only your post")
        }
    }catch(err){
        res.status(500).json(err);
    }
}
);
//like a post
router.put("/:id/like",async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("post has been liked")
        }
    } catch (error) {
       res.status(500).json(error)  
    }
   

})
//dislike a post
router.put("/:id/like",async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("post has veen disliked")
        }
    } catch (error) {
       res.status(500).json(error)  
    }
   

})

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {
  let postArray=[];
  try {
  const currentUser=await User.findById(req.params.userId)
  const userPosts=await Post.find({userId:currentUser._id})  
  const friendPosts=await Promise.all(
    currentUser.followings.map(friendId=>{
       return Post.find({userId:friendId})
    })
  )
  res.status(200).json(userPosts.concat(...friendPosts))
  } catch (error) {
    res.status(500).json(error)
  }
});

//GET USERS all POSTS
router.get("/profile/:username", async (req, res) => {
  let postArray=[];
  try {
    const user=await User.findOne({username:req.params.username})
  const posts=await Post.find({userId:user._id})
          res.status(200).json(posts)
  } catch (error) {
    res.status(500).json(error)
  }
});
module.exports = router;