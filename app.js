const express = require('express');
const http= require("http");
const path=require("path");

const app=express();

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine","ejs"); 
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function(socket){
  socket.on("send-location", function(data){
    io.emit("receive-location", {id:socket.id, ...data});
  });
  socket.on("disconnect", function(){
    io.emit("user-disconnected", socket.id);
  });
  
});

app.get("/", function(req,res){
  res.render("index");
});

// server.listen(3000);
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});