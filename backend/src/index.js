/*
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import WebSocket from 'ws'
import mongo from './mongo';
import wsConnect from './wsConnect'
import { v4 as uuidv4 } from 'uuid';
*/
import server from './server';
import mongo from './mongo';


mongo.connect();




/*
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const db = mongoose.connection
db.once('open', () => {
  console.log("MongoDB connected!");
  wss.on('connection', (ws) => {
    // wsConnect.initData(ws); 新的不用
    ws.id = uuidv4();
    ws.box = ''; //⽤來記錄⽬前 active ChatBox name
    ws.onmessage = wsConnect.onMessage(wss, ws);
// Define WebSocket connection logic
  });
});
*/


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => { 
  console.log(`Example app listening on port ${PORT}!`)
});