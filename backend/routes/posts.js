const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const postController = require("../controllers/posts");

const router = express.Router();

// Create a post
router.post("", checkAuth, extractFile, postController.createPost);

// Edit Post
router.put("/:id", checkAuth, extractFile, postController.updatePost);

// Get all post
router.get("", postController.getPosts);

// Get Post by id
router.get("/:id", postController.getPostById);

// Deleting documents
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
