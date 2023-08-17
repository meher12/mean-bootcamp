const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://maher:ZBca0Ca9xkmBDBjS@cluster0.dca3xkg.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(() => {
  console.log('Connected to database!')
})
.catch(() => {
  console.log('Connection failed!')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* 
app.use((req, res, next) => {
  console.log('First middleware');
  next();
});

app.use((req, res, next) => {
    res.send('Hello from express!');
     next();
}); */

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin", "*"
    );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
   );
   next();
});

// create a post
app.post("/api/posts", (req, res, next) => {
  //const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // to save post in mongodb database
  // console.log(post);
  post.save();
  res.status(201).json({
    message: "Posts added succesfully!"
  });
});

// get post list
app.get("/api/posts", (req, res, next) => {
 /*  const posts = [
    {
      id: "dfrt56t",
      title: "First server-side post",
      content: "This is coming from server",
    },

    {
      id: "5987rty",
      title: "Second server-side post",
      content: "This is coming from server!",
    },
  ]; */
  Post.find().then(documents => {
      console.log(documents);
      res.status(200).json({
        message: "Posts fetched succesfully!",
        posts: documents
    });
  });
});

// add app as module to use it in server.js
module.exports = app;
