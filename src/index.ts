import { ChatServer } from './chatServer';
import express from 'express';
import { StrategeryServer } from './strategeryServer/server';

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

let server = app.listen(PORT, () => {
  console.log(`running on port ${PORT}.`);
});

const io = require('socket.io')(server, { cors: { origin: '*', } });

new ChatServer().start(app, io);
new StrategeryServer().start(app, io);