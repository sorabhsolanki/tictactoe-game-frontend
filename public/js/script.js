
var origBoard;
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    // console.log(origBoard);
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; //clear
        cells[i].style.removeProperty('background-color');
        //add a event process vào click mouse event
        cells[i].addEventListener('click', turnClick, false);
    }
}

function startGameAgain() {
    document.querySelector(".endgame").style.display = "none";
    document.getElementById("usrName").value = '';
    document.getElementById("roomNo").value = '';
    document.getElementById("opponentName").innerHTML = '';
    document.getElementById("assignedSymbol").innerHTML = '';
    document.getElementById("startGame").innerText = '';
    origBoard = Array.from(Array(9).keys());
    // console.log(origBoard);
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; //clear
        cells[i].style.removeProperty('background-color');
        //add a event process vào click mouse event
        cells[i].addEventListener('click', turnClick, false);
    }
    ws.close();
}


function turnClick(square) {
  turn(square.target.id);
}

function turn(squareId) {
    if(emptyCheck(ws)){
        alert("Please first enter in a room");
        return;
    }
    sendPlayMessage(squareId);
}




let ws;
function WebSocketTest() {
   if ("WebSocket" in window) {
       let name = document.getElementById("usrName").value;
       let room = document.getElementById("roomNo").value;
       //open websocket
       ws = new WebSocket("ws://localhost:8002/tictactoeserver");

      ws.onopen = function() {
         // Web Socket is connected, send data using send()
         var data = JSON.stringify({
                       userName: name,
                       roomNo: room,
                       message: "loggingin"
                    });
         ws.send(data);
      };

      ws.onmessage = function (evt) {
         var received_msg = JSON.parse(evt.data);
         if(emptyCheck(received_msg.message)){
           return;
         }

         if(received_msg.message == 'loggingin'){
              if(!emptyCheck(received_msg.opponentName)){
                  document.getElementById("opponentName").innerHTML = "Your opponent: " + received_msg.opponentName;
              }
              if(!emptyCheck(received_msg.symbol)){
                  document.getElementById("assignedSymbol").innerHTML = "Your Assigned Symbol : " + received_msg.symbol;
              }
         } else if(received_msg.message == 'playing'){
              document.getElementById(received_msg.boardIndex).innerText = received_msg.symbol;
         } else if(received_msg.message == 'startgame'){
              document.getElementById("startGame").innerText = "You are the choosen one. Start the game.";
         } else if(received_msg.message == 'winning'){
              document.getElementById(received_msg.boardIndex).innerText = received_msg.symbol;
              document.querySelector(".endgame").style.display = "block";
              document.querySelector(".endgame .text").innerText = received_msg.winningMessage;
         }
      };

      ws.onclose = function() {
         // websocket is closed.
         alert("Game closed...");
      };
   } else {
      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your Browser!");
   }
}

 function sendPlayMessage(index) {
    var data = JSON.stringify({
                  index:index,
                  message: "playing"
               });
    ws.send(data);
 }

 function emptyCheck(val) {
    return val === undefined || val === null ? true:false;
 }
