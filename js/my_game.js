window.closeWrong = closeWrong;
window.digitFocus = digitFocus;
window.pressCard = pressCard;

const gameHeight = document.querySelector("body").offsetHeight;

const content = document.querySelector(".content");
var game = document.getElementsByClassName("game-content")[0];
var digitPos = [];
var nowOrder = 1;
var nowMax = 0;
var quesTimer = 0;
var counter;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// hello.js
function hello() {
  content.classList.add("slight_opacity");

  // Get the modal
  var game_modal = document.getElementById("myGame");
  game_modal.style.display = "block";

  game.innerHTML =
    '<h3>選擇等級</h3><select name="digits" id="digits" style="margin:10px;padding:10px;width:100px;height:40px;" >' +
    '<optgroup label="Swedish Cars">' +
    '<option value="3">3</option>' +
    '<option value="5" selected>5</option>' +
    '<option value="7">7</option>' +
    '<option value="9">9</option>' +
    "</optgroup>" +
    "</select>" +
    "<button class='game_button' onclick='digitFocus()'>開始遊戲</button>" +
    '<span class="time_left_txt">己花</span>' +
    '<span class="timer_sec" id="my_game_sec">00</span>' +
    "<span >秒</span>" +
    "<button style='float:right' class='game_button' onclick='closeWrong()'>離開遊戲</button>" +
    "</br><label id='nowOrder'> 0 </label>";

  // gameContent.innerHTML =
  //   "<h1>hello world</h1><button class='boardGame'>離開遊戲</button>";
}

function closeWrong() {
  var modal = document.getElementById("myGame");
  modal.style.display = "none";
  content.classList.remove("slight_opacity");
  clearInterval(counter); //clear counter
}

function pressCard() {
  if (this.id == "card" + nowOrder) {
    nowOrder++;
    var target = document.getElementById("nowOrder");
    target.innerText = "請按右邊數字 " + nowOrder;
    if (nowOrder == nowMax + 1) {
      clearInterval(counter); //clear counter
      target.innerText = "你花了 " + quesTimer + " 秒完成";
    }
  }
}

function digitFocus() {
  nowOrder = 1;
  var e = document.getElementById("digits");
  var value = e.options[e.selectedIndex].value;
  var text = e.options[e.selectedIndex].text;
  var game_table = document.getElementById("game_table");
  var target = document.getElementById("nowOrder");
  target.innerText = target.innerText = "請從數字 1 按到數字 25";

  var tmpResult;
  tmpResult = "<table id='game_table' class='table-top'>";

  var cardWidth = Math.round((gameHeight - 300) / text);
  if (game_table != null) game_table.remove();

  quesTimer = 0;
  digitPos = [];
  for (var i = 1; i <= text * text; i++) {
    digitPos.push(i);
  }

  shuffle(digitPos);
  nowMax = text * text;
  for (var i = 0; i < text; i++) {
    tmpResult += "<tr>";
    for (var j = 0; j < text; j++) {
      tmpResult += "<td class='card_container' style='width:";
      tmpResult += cardWidth;
      tmpResult += "px;height:";
      tmpResult += cardWidth;
      tmpResult += "px' id='card";
      tmpResult += digitPos[i * text + j];
      tmpResult += "'>";

      tmpResult += digitPos[i * text + j];
      tmpResult += "</td>";
    }
    tmpResult += "</tr>";
  }
  tmpResult += "</table>";
  game.innerHTML = game.innerHTML + tmpResult;

  //0.1. Set Subject
  var card_links = document.querySelectorAll(".card_container");
  for (let i = 0; i < card_links.length; i++) {
    card_links[i].addEventListener("click", pressCard);
  }
  startTimer();
}

function startTimer() {
  counter = setInterval(timer, 1000);
  function timer() {
    var timeSec = document.getElementById("my_game_sec");
    timeSec.innerText = quesTimer;
    quesTimer++;
    if (quesTimer < 10 && quesTimer > 0) {
      timeSec.innerText = "0" + quesTimer;
    } else timeSec.innerText = quesTimer;
  }
}

export default hello;
