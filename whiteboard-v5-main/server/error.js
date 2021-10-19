const fs = require("fs");
const path = require("path");

module.exports = {
  socket: (error) => {
    console.log(error);
    const log = `error: ${error} date: ${new Date()}\n`;
    fs.appendFile(path.join(__dirname, "logs", "socketError.txt"), log, (err) => {
      console.log(err);
    });
  },
  db: (error) => {
    console.log(error);
    const log = `error: ${error} date: ${new Date()}\n`;
    fs.appendFile(path.join(__dirname, "logs", "dbError.txt"), log, (err) => {
      console.log(err);
    });
  },
  valid: (error) => {
    console.log(error);
    const log = `error: ${error} date: ${new Date()}\n`;
    fs.appendFile(path.join(__dirname, "logs", "validProblems.txt"), log, (err) => {
      console.log(err);
    });
  },
};
