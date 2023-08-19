const express = require("express");
const multer = require("multer");
const { response } = require("../app");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage  = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name +'-'+ Date.now()+'.'+ext);
  }
});

// Create a post
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  //const post = req.body;
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  // to save post in mongodb database
  // console.log(post);
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Posts added succesfully!",
      post: {
        ...createdPost,
        id: createdPost._id
      }
       
    });
  });
});

// Edit Post
router.put("/:id",
 multer({storage: storage}).single("image"),
 (req, res, next) => {
   let imagePath = req.body.imagePath;
   if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath =  url + "/images/" + req.file.filename
   }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

// Get all post
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
     postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then((documents) => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

// Get Post by id
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

// Deleting documents
router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post delete" });
  });
});

module.exports = router;
