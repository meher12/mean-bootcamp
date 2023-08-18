const express = require("express");

const Post = require("../models/post");

const router = express.Router();

// Create a post
router.post("", (req, res, next) => {
  //const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // to save post in mongodb database
  // console.log(post);
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Posts added succesfully!",
      postId: createdPost._id,
    });
  });
});

// Edit Post
router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

// Get all post
router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: documents,
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