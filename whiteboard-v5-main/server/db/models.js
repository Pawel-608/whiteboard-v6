const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let BoardSchema = new Schema({
  board: {
    type: String,
    unique: true,
    required: true,
  },
  users: [
    {
      nick: {
        type: String,
      },
      socket: {
        type: String,
      },
      token: {
        type: String,
      },
      drawingProperties: {
        lineWidth: Number,
        color: String,
        tool: String,
      },
    },
  ],
  superUsers: [{ token: String }],
  admin: { token: String },
});

let Board = mongoose.model("Board", BoardSchema);

module.exports = { Board };
