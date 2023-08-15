const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('First middleware');
  next();
});

app.use((req, res, next) => {
    res.send('Hello from express!');
     next();
   });
 
 // add app as module to use it in server.js
   module.exports = app;