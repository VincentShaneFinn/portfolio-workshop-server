import { ChatServer } from './chatServer';
import express from 'express';

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use("/",(req, res) =>{
  res.send("<h1>Welcome to your simple server! Awesome right</h1>");
});

let server = app.listen(PORT, () => {
  console.log(`running on port ${PORT}.`);
});

const io = require('socket.io')(server, { cors: { origin: '*', } });

new ChatServer().start(app, io);