let socket = io();
let flag = false;

///todo REWRITE

const createBoard = document.getElementsByClassName("btn")[0],
  boardNameIn = document.getElementsByClassName("txt-inp")[0],
  enterBoard = document.getElementsByClassName("enter-board")[0],
  invalidBoard = document.getElementsByClassName("invalid-id")[0];

//Create new board
createBoard.addEventListener("click", () => {
  socket.emit("createBoard", (success, board, token) => {
    if (success == false) return (location.href = `${location.href}err`);

    localStorage.setItem("me", JSON.stringify({ token: token, perm: 2 }));
    localStorage.removeItem("img");
    location.href = `${location.href}board/${board}`;
  });
});

//Enter to existing board
enterBoard.addEventListener("click", enterToBoard);
window.addEventListener("keypress", (e) => {
  if (e.key == "Enter") enterToBoard();
});

function enterToBoard() {
  if (!flag) {
    boardNameIn.style.setProperty("border-color", "#d12c2c");
    invalidBoard.className = "invalid-id";
    return;
  }
  location.href = `${location.href}board/${boardNameIn.value}`;
}

//check if board exists
boardNameIn.addEventListener("input", checkBoard);

function checkBoard() {
  if (boardNameIn.value.length == 8) {
    invalidBoard.innerText = "";
    invalidBoard.className = "hide";
    boardNameIn.style.setProperty("border-color", "#494949");

    socket.emit("checkBoard", boardNameIn.value.toLowerCase(), (data) => {
      console.log(data);
      let { success, exists } = data;
      if (!success) return (location.href = `${location.href}err`);

      if (exists) {
        flag = true;
      } else {
        boardNameIn.style.setProperty("border-color", "#d12c2c");
        invalidBoard.innerText = "Invalid Board Id";
        invalidBoard.className = "invalid-id";
        flag = false;
      }
    });
  } else {
    boardNameIn.style.setProperty("border-color", "#d12c2c");
    invalidBoard.innerText = "Board Id Should Have 8 Charts";
    invalidBoard.className = "invalid-id";
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// let socket = io();
// let flag = false;

// const btn = document.getElementsByClassName("btn")[0];
// const txtInp = document.getElementsByClassName("txt-inp")[0];
// const enterBoardBtn = document.getElementsByClassName("enter-board")[0];
// const invalidBoard = document.getElementById("invalid-id");

// btn.addEventListener("click", newBoard);
// window.addEventListener("keypress", (e) => {
//   if (e.key == "Enter") enterToBoard();
// });
// enterBoardBtn.addEventListener("click", enterToBoard);

// txtInp.addEventListener("input", checkBoard);

// function newBoard() {
//   socket.emit("createBoard", (success, board, token) => {
//     if (success == false) return (location.href = `${location.href}err`);
//     localStorage.setItem("me", JSON.stringify({ token: token, perm: 2 }));
//     localStorage.setItem("board", board);
//     localStorage.setItem("perm", 2);
//     location.href = `${location.href}board/${board}`;
//   });
// }

// function enterToBoard() {
//   if (!flag) {
//     txtInp.style.setProperty("border-color", "#d12c2c");
//     invalidBoard.innerText = "Board Id Should Have 8 Charts";
//     invalidBoard.className = "invalid-id";
//     return;
//   }

//   socket.emit("addUser", (success, token) => {
//     if (success == false) return (location.href = `${location.href}err`);
//     localStorage.setItem("me", JSON.stringify({ token: token, perm: 0 }));
//     localStorage.setItem("board", board);
//     localStorage.setItem("perm", 0);
//     location.href = `${location.href}board/${txtInp.value}`;
//   });
// }

// function checkBoard() {
//   if (txtInp.value.length == 8) {
//     invalidBoard.innerText = "";
//     invalidBoard.className = "hide";
//     txtInp.style.setProperty("border-color", "#494949");

//     socket.emit("checkBoard", { board: txtInp.value.toLowerCase() }, (data) => {
//       console.log(data);
//       if (data.status == 1) {
//         flag = true;
//       } else {
//         console.log(data);
//         txtInp.style.setProperty("border-color", "#d12c2c");
//         invalidBoard.innerText = "Invalid Board Id";
//         invalidBoard.className = "invalid-id";
//         flag = false;
//       }
//     });
//   } else {
//     txtInp.style.setProperty("border-color", "#d12c2c");
//     invalidBoard.innerText = "Board Id Should Have 8 Charts";
//     invalidBoard.className = "invalid-id";
//   }
// }
