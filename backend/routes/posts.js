const express = require("express");
const multer = require("multer");
const { response } = require("../app");

const checkAuth = require("../middleware/check-auth");

const postController = require("../controllers/posts");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// Create a post
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.createPost
);

// Edit Post
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.updatePost
);

// Get all post
router.get("", postController.getPosts);

// Get Post by id
router.get("/:id", postController.getPostById);

// Deleting documents
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
