const http = require('http');
const app = require('./backend/app');

const port = process.env.PORT || 3000;

/* const server = http.createServer((req, res) => {
  res.end('This my first response!');
}); */

app.set('port', port);
const server = http.createServer(app);

server.listen(port);