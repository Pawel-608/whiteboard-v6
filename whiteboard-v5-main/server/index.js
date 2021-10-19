const express = require("express");
const helmet = require("helmet");

const app = (global.app = express());
const PORT = 5000;
// const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = (global.io = require("socket.io")(server));

//Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./socket")(io);
require("./router")(app);
