<b><h2>terrible code up here^</h2></b>
<br>

# whiteboard-v6

This board allows you to share workspace with others

## Features

- Share your workspace with others in room
- Decide who can draw in your room
- Download drawings as jpgs

## Used technologies

- JS
- Node.js
- Express
- WebSockets (Socket.io)
- MongoDB

## Short description

Application allows to create room witch shared board. Creator can choose which users can draw.
When you draw you're sending every point (x, y) to server via WebSockets and then to other room members. When a new member joins the room, the creator's canvas is converted into a picture, sent to him, and redrawed onto his canvas.
