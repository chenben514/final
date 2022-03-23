//selecting all required elements
const maxQuesCnt = 500;
const quesTimer = 30;
const start_btn = document.querySelector(".test-button");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const select_list = document.querySelector(".select_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const userName = document.querySelector(".user-nav__user-name");
const content = document.querySelector(".content");
const sideBar = document.querySelector(".sidebar");
let curQuiz = "";
let ansQuesCnt = 0;
let quizType = "";
let curStatus = "nextQues";
let correctCnt = 0;
let cursubject = "";
let curLevel = 0;
let userInputAns = "";

//0.1. Set Subject
const subject_links = document.querySelectorAll(".side-nav__link");
for (let i = 0; i < subject_links.length; i++) {
  subject_links[i].addEventListener("click", setCourse);
}

function setCourse() {
  // alert("ben_debug_29");
  var preElement = document.getElementById(curCourse).parentNode;
  preElement.classList.remove("side-nav__item--active");

  curCourse = this.id;
  localStorage.setItem("lastCourse", curCourse);
  var element = document.getElementById(this.id).parentNode;
  element.classList.add("side-nav__item--active");

  showTopic();

  //0.3. Set Main Subject
  const main_subject_links = document.querySelectorAll(".main_subj__photo");
  for (let i = 0; i < main_subject_links.length; i++) {
    // alert("ben_debug:52" + main_subject_links[i].id);
    main_subject_links[i].addEventListener("click", setMainSubject);
  }

  //0.2. Set Subject
  let small_test_links = document.querySelectorAll(".test-button");
  for (let i = 0; i < small_test_links.length; i++) {
    small_test_links[i].addEventListener("click", startQuiz);
  }
}

//0.2. Set Last Course
// alert(curCourse);
var element = document.getElementById(curCourse).parentNode;
element.classList.add("side-nav__item--active");

//0.3. Set Main Subject
const main_subject_links = document.querySelectorAll(".main_subj__photo");
for (let i = 0; i < main_subject_links.length; i++) {
  // alert("ben_debug:52" + main_subject_links[i].id);
  main_subject_links[i].addEventListener("click", setMainSubject);
}

function setMainSubject() {
  var preElement = document.getElementById(curMainSubj).parentNode;
  preElement.classList.remove("main_subj__item--active");

  curMainSubj = this.id;

  var element = document.getElementById(this.id).parentNode;
  element.classList.add("main_subj__item--active");

  localStorage.setItem(curCourse + "_main_subj", curMainSubj);
  showTopic();

  const tmp_main_subject_links = document.querySelectorAll(".main_subj__photo");
  for (let i = 0; i < tmp_main_subject_links.length; i++) {
    tmp_main_subject_links[i].addEventListener("click", setMainSubject);
  }

  let small_test_links = document.querySelectorAll(".test-button");
  for (let i = 0; i < small_test_links.length; i++) {
    small_test_links[i].addEventListener("click", startQuiz);
  }
}

//0.4. Set Small Course
let small_test_links = document.querySelectorAll(".test-button");
for (let i = 0; i < small_test_links.length; i++) {
  small_test_links[i].addEventListener("click", startQuiz);
}

// if startQuiz button clicked
function startQuiz() {
  curQuiz = this.id;
  if (getQuestions() == false) return;
  ansQuesCnt = 0;
  quiz_box.classList.add("activeQuiz"); //show quiz box
  showQuestions(0); //calling showQestions function
  queCounter(1); //passing 1 parameter to queCounter
  startTimer(quesTimer); //calling startTimer function
  startTimerLine(0); //calling startTimerLine function
}

let timeValue = quesTimer;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
let nowCursorFocus = 0;
let curQuesType = "";

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = () => {
  localStorage.setItem(curQuiz + "_right", "");
  window.location.reload(); //reload the current window
  return;
  //no-way-here
};

// if quitQuiz button clicked
quit_quiz.onclick = () => {
  window.location.reload(); //reload the current window
};

const next_btn = document.querySelector("footer .next_btn");
const quit_btn = document.querySelector("footer .quit_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
  if (que_count < questions.length - 1 && que_count < maxQuesCnt - 1) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    showQuestions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
    timeText.textContent = "還剩"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    showResult(); //calling showResult function
  }
};

// if Quit Que button clicked
quit_btn.onclick = () => {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  showResult(); //calling showResult function
};

function checkFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open("HEAD", urlToFile, false);
  xhr.send();

  if (xhr.status == "404") {
    return false;
  } else {
    return true;
  }
}
function getQuestions() {
  //ben_test
  // var selFile =
  //   "./data/" + currentSubject + "_" + currentTopic + "_" + 0 + ".csv";
  // alert(container.clientWidth);

  var curQuizArr = curQuiz.split("-");
  cursubject = curQuizArr[1].split("_")[0];
  correctCnt = 0;

  curQuizType = curQuizArr[0];
  var selFile = "./data/" + curQuizArr[1] + ".csv";

  if (checkFileExist(selFile) == false) {
    alert("Quiz file [" + selFile + "] does not exist.");
    return false;
  }

  var read = new XMLHttpRequest();
  read.open("GET", selFile, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();

  var displayName = read.responseText;
  var quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
  var quesList = [];
  let quesCnt = quesArr.length;
  let ansList = [];
  let tmpCnt = 0;

  let tmpArr = [];
  let k = 0;

  var rightStorage = localStorage.getItem(curQuiz + "_right");
  var wrongStorage = localStorage.getItem(curQuiz + "_wrong");
  if (rightStorage == null || rightStorage == "undefined")
    rightStorage = "nothing";
  if (wrongStorage == null || wrongStorage == "undefined")
    wrongStorage = "nothing";
  let tmpMessage = "";
  for (let k = 0; k < quesCnt; k++) {
    if (quesArr[k].length < 2) continue;
    tmpMessage = k + ",";
    var checkMessage = "," + tmpMessage;
    if (rightStorage.includes(checkMessage)) {
      if (!wrongStorage.includes(checkMessage)) {
        correctCnt++;
        continue;
      }
    }
    tmpArr.push(tmpMessage + quesArr[k]);
  }
  localStorage.setItem(curQuiz + "_wrong", "");
  quesArr = tmpArr;
  quesCnt = quesArr.length;
  if (quesCnt == 0) {
    curStatus = "allQuesPass";
    showResult();
    return false;
  }

  // if (quesCnt > maxQuesCnt) {
  //   quesCnt = 10;
  // }

  //1.get random list from file
  while (quesList.length < quesCnt) {
    var r = Math.floor(Math.random() * quesCnt);
    if (quesList.indexOf(r) === -1) quesList.push(r);
  }

  class Question {
    numb;
    question;
    answer;
    option1;
    option2;
    option3;
    option4;
    direct_answers = [];
    quizType;
  }
  //2.generate questions

  questions = [];
  var i;
  var j;
  for (i = 0; i < quesCnt; i++) {
    var ques_comma_pos = quesArr[quesList[i]].indexOf(",");
    var ques_length = quesArr[quesList[i]].length;
    var singQuesArr = quesArr[quesList[i]]
      .substr(ques_comma_pos + 1, ques_length - ques_comma_pos - 1)
      .split("\t");
    let question = new Question();

    question.numb = quesArr[quesList[i]].substr(0, ques_comma_pos);
    if (singQuesArr[0].includes("[")) {
      var tmpQues = singQuesArr[0];
      var tmpStart = tmpQues.indexOf("[");
      var tmpEnd = tmpQues.indexOf("]");

      question.question =
        '<span style="color:blue;font-size:20px;">' +
        tmpQues.substr(0, tmpStart) +
        "[";

      for (var z = 0; z < tmpEnd - tmpStart - 1; z++) {
        if (tmpQues.substr(tmpStart + z + 1, 1) == " ")
          question.question = question.question + "_";
        else question.question = question.question + "X";
      }

      question.question =
        question.question +
        "]" +
        tmpQues.substr(tmpEnd + 1, tmpQues.length - tmpEnd - 1) +
        "</span> : " +
        '<span style="color:grey;font-size:20px;">' +
        singQuesArr[1] +
        "</span>";

      question.quizType = "spell";
      question.answer = tmpQues.substr(tmpStart + 1, tmpEnd - tmpStart - 1);
    } else if (singQuesArr[2] == "--") {
      question.question =
        "[" + "X".repeat(singQuesArr[0].length) + "]" + singQuesArr[1];
      question.answer = singQuesArr[0];
      question.quizType = "spell";
    } else {
      question.question = singQuesArr[0];
      question.answer = singQuesArr[1];
      question.quizType = "choose";
    }
    ansList = [];
    while (ansList.length < 4) {
      var r = Math.floor(Math.random() * 4) + 1;
      if (ansList.indexOf(r) === -1) ansList.push(r);
    }

    question.option1 = singQuesArr[ansList[0]];
    question.option2 = singQuesArr[ansList[1]];
    question.option3 = singQuesArr[ansList[2]];
    question.option4 = singQuesArr[ansList[3]];

    questions[i] = question;
  }
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}

function pronClick() {
  var mp3File = "./audio/" + questions[que_count].question;
  if (UrlExists(mp3File)) {
    var audio = new Audio(mp3File);
    audio.play();
  } else {
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = questions[que_count].question.replace(".mp3", "");

    // Set the attributes.
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  }
  // alert(mp3File);
  // try {
  //   var audio = new Audio(mp3File);
  //   if (isNaN(sound.duration)) alert("Do something");
  //   audio.play();
  // } catch {
  //   alert("no file:" + mp3File);
  //   var msg = new SpeechSynthesisUtterance();

  //   // Set the text.
  //   msg.text = questions[que_count].question.replace(".mp3", "");

  //   // Set the attributes.
  //   msg.volume = 1;
  //   msg.rate = 1;
  //   msg.pitch = 1;
  //   window.speechSynthesis.speak(msg);
  // }

  // If a voice has been selected, find the voice and set the
  // utterance instance's voice attribute.
  /*
  if (voiceSelect.value) {
    msg.voice = speechSynthesis.getVoices().filter(function (voice) {
      return voice.name == voiceSelect.value;
    })[0];
  }
*/
  // Queue this utterance.
  // window.speechSynthesis.speak(msg);
}

function confirmClick() {
  let inputAnswer = document.querySelector(".direct_input").value;
  let correctAnswer = "";
  userInputAns = inputAnswer;
  document.querySelector("#confirmButton").disabled = "true";
  if (curQuesType === "direct_input") {
    correctAnswer = questions[que_count].answer;
  } else {
    correctAnswer = questions[que_count].question.replace(".mp3", "");
  }
  if (inputAnswer === correctAnswer) directSelected("correct", correctAnswer);
  else directSelected("incorrect", correctAnswer);
}

// getting questions and options from array
function showQuestions(index) {
  content.classList.add("slight_opacity");

  const que_text = document.querySelector(".que_text");
  ansQuesCnt++;
  nowCursorFocus = 0;
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = "<span>" + questions[index].question + "</span>";

  let option_tag =
    '<div class="option" id="option1"><span>' +
    "1." +
    questions[index].option1 +
    "</span></div>" +
    '<div class="option"  id="option2"><span>' +
    "2." +
    questions[index].option2 +
    "</span></div>" +
    '<div class="option"  id="option3"><span>' +
    "3." +
    questions[index].option3 +
    "</span></div>" +
    '<div class="option"  id="option4"><span>' +
    "4." +
    questions[index].option4 +
    "</span></div>" +
    '<div class="option"  id="option5""><span>' +
    "5.不知道答案" +
    "</span></div>";
  let confirm_button = "";

  if (questions[index].quizType == "spell") {
    curStatus = "spell";
    let answer_target =
      '<div><input type="text" class="direct_input" name="direct_input" id="direct_input" value="" placeholder="輸入答案" style="width:40%;height:40px;font-size:20px;padding:10px;">';
    answer_target +=
      "<span> <button id='confirmButton' onclick='confirmClick()' style='width:70px;height:40px;' >確認</button></span> </div>";
    curQuesType = "direct_input";
    que_text.innerHTML = questions[index].question; //adding new span tag inside que_tag
    option_list.innerHTML = answer_target;
    document.querySelector(".direct_input").focus();
    document.removeEventListener("keydown", keydown);
  } else {
    curStatus = "choose";
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for (i = 0; i < option.length; i++) {
      option[i].setAttribute("onclick", "optionSelected(this)");
    }
    document.addEventListener("keydown", keydown);
  }

  quit_btn.classList.add("show"); //show the next button if user selected any option
}

// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>  ';
let crossIconTag =
  '<div class="icon cross"><div class="diag1"></div><div class="diag2"></div><i class="fas fa-times"></i></div>';

function directSelected(userAns, correctAns) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine

  if (userAns === "correct") {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    if (curQuesType === "direct_input") {
      document.querySelector(".direct_input").style.backgroundColor = "green";
    }
    keepRightAnswer();
    // alert("ben_debug_437:" + rightStorage);
  } else {
    console.log("Wrong Answer");
    keepWrongAnswer();
    if (curQuesType !== "direct_input") {
      document.querySelector(".option").classList.add("incorrect");
    } //adding red color to correct selected option
    else {
      // document.querySelector(".direct_input").style.backgroundColor = "red";

      let answer_target = (option_list.innerHTML =
        option_list.innerHTML +
        '<div name="answer" style="width:60%;height:40px;font-size:20px;padding:10px;color:blue">' +
        '<span style="color:blue">' +
        "正確答案：" +
        correctAns +
        "</span>" +
        '<br><span style="color:red">' +
        "錯誤答案：" +
        userInputAns +
        "</span" +
        "</div>");
    }
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
  next_btn.focus();
}

//if user clicked on option
function optionSelected(answer) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let userAns = answer.textContent.substr(2, answer.textContent.length - 2); //getting user selected option
  let correcAns = questions[que_count].answer; //getting correct answer from array
  const allOptions = option_list.children.length; //getting all option items

  if (answer === "correct") userAns = correcAns;

  if (userAns == correcAns) {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
    keepRightAnswer();
    // alert("ben_debug_483:" + rightStorage);
  } else {
    keepWrongAnswer();
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");

    for (i = 0; i < allOptions; i++) {
      if (
        option_list.children[i].textContent.substr(
          2,
          option_list.children[i].textContent.length - 2
        ) == correcAns
      ) {
        //if there is an option which is matched to an array answer
        option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        console.log("Auto selected correct answer.");
      }
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
  curStatus = "nextQues";
}

function keepRightAnswer() {
  var rightStorage = localStorage.getItem(curQuiz + "_right");
  if (
    rightStorage == null ||
    rightStorage == "undefined" ||
    rightStorage.length < 2
  ) {
    rightStorage = "," + questions[que_count].numb + ",";
  } else rightStorage = rightStorage + questions[que_count].numb + ",";
  localStorage.setItem(curQuiz + "_right", rightStorage);
}

function keepWrongAnswer() {
  var wrongStorage = localStorage.getItem(curQuiz + "_wrong");
  var tmpMessage;
  if (
    wrongStorage == null ||
    wrongStorage == "undefined" ||
    wrongStorage.length < 2
  ) {
    wrongStorage = "," + questions[que_count].numb + ",";
  } else {
    tmpMessage = questions[que_count].numb + ",";
    var checkMessage = "," + tmpMessage;
    if (wrongStorage.includes(checkMessage)) return;
    wrongStorage = wrongStorage + questions[que_count].numb + ",";
  }
  localStorage.setItem(curQuiz + "_wrong", wrongStorage);
}

function showResult() {
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  if (curStatus == "allQuesPass") {
    return;
  }
  const scoreText = result_box.querySelector(".score_text");
  const resultICON = result_box.querySelector(".icon");

  //let final_score = Math.floor((userScore * 100) / questions.length);
  var tmpQuesCnt;
  if (questions.length > maxQuesCnt) tmpQuesCnt = maxQuesCnt;
  else tmpQuesCnt = questions.length;
  let final_score = Math.floor((userScore * 100) / ansQuesCnt);

  // if (myNewScore > myStorageScore)
  //   localStorage.setItem(selCategory + "_" + selLevel, myNewScore);

  if (final_score === 100) {
    // if user scored more than 3
    resultICON.innerHTML = '<i class="fas fa-crown"></i>';
    //creating a new span tag and passing the user score number and total question number
    let scoreTag =
      "<span>恭喜 " +
      userName.innerHTML +
      "🎉, 你得到 <p>" +
      final_score +
      "</p> 分 </span>";

    if (userScore == questions.length) {
      scoreTag += "<span>恭喜";
      scoreTag += userName.innerHTML;
      scoreTag +=
        " ! , 你完成本課程了！！！</span><span style='font-size:6rem;text-align:center'>";
      raiseStarLevel();
      for (var i = 0; i < curLevel; i++) {
        scoreTag += "🏆";
      }
      scoreTag += "</span>";
    }
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
  } else if (final_score >= 80) {
    // if user scored more than 1
    resultICON.innerHTML = '<i class="fas fa-grin-beam-sweat"></i>';
    let scoreTag =
      "<span>不錯 😎, 你得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // if user scored less than 1
    resultICON.innerHTML = '<i class="fas fa-tired"></i>';
    let scoreTag =
      "<span>很可惜 😐, 你只得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "時間到"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns = questions[que_count].answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      next_btn.classList.add("show"); //show the next button if user selected any option
    }
  }
}

function startTimerLine(time) {
  var tmpCount = (29 * quesTimer) / 15;
  counterLine = setInterval(timer, tmpCount);
  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function queCounter(index) {
  //creating a new span tag and passing the question number and total question
  var tmpCorrect = correctCnt + userScore;
  var tmpTotal = correctCnt + questions.length;
  var tmpScore = (tmpCorrect * 100) / tmpTotal;
  let totalQueCounTag =
    "<span> 問題 (	&nbsp; <p>" +
    index +
    "</p> / <p>" +
    questions.length +
    " )" +
    " -- 總題數 (" +
    tmpTotal +
    ") 己答對 (" +
    tmpCorrect +
    "題) </p></span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}

function keydown(e) {
  // alert("ben_debug:" + e.code);
  e.preventDefault();
  switch (e.code) {
    case "Enter":
      if (curStatus == "nextQues") {
        next_btn.click();
      }
      break;
    case "Digit1":
      if (curStatus == "choose") {
        document.getElementById("option1").click();
      }
      break;
    case "Digit2":
      if (curStatus == "choose") {
        document.getElementById("option2").click();
      }
      break;
    case "Digit3":
      if (curStatus == "choose") {
        document.getElementById("option3").click();
      }
      break;
    case "Digit4":
      if (curStatus == "choose") {
        document.getElementById("option4").click();
      }
      break;
    case "Digit5":
      if (curStatus == "choose") {
        document.getElementById("option5").click();
      }
      break;
    default:
      if (curStatus == "spell") {
        document.querySelector(".direct_input").value =
          document.querySelector(".direct_input").value + e.code;
      }
  }
}

function raiseStarLevel() {
  var i;
  var prevLevelStorage;
  var curLevelStorage;
  for (i = 3; i > 0; i--) {
    curLevelStorage = localStorage.getItem(cursubject + "_level_" + i);
    if (
      curLevelStorage == null ||
      curLevelStorage == "undefined" ||
      curLevelStorage.length < 2
    ) {
      prevLevelStorage = "";
      continue;
    }
    if (curLevelStorage.includes(curQuiz + ";")) {
      break;
    }
    prevLevelStorage = curLevelStorage;
  }
  curLevel = i;

  if (curLevel < 3) {
    curLevel++;
    prevLevelStorage = prevLevelStorage + curQuiz + ";";
    localStorage.setItem(cursubject + "_level_" + curLevel, prevLevelStorage);
  }
  localStorage.setItem(curQuiz + "_right", "");
  return;
}
