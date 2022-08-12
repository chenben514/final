var curProcCnt = 0;

const topic_view = document.querySelector(".main_subj");
const subject_view = document.querySelector(".mid_subj");
class Topic {
  numb;
  course;
  main_subj;
  open_course_cnt;
  mid_subj;
  mid_explain;
  quiz_type;
  small_subjs = [];
  small_subj_explains = [];
  small_subj_html = [];
}
var topics = [];

curCourse = localStorage.getItem("lastCourse");
if (curCourse == "undefined" || curCourse == null) curCourse = "korean";

curMainSubj = localStorage.getItem(curCourse + "_main_subj");
if (curMainSubj == "undefined" || curMainSubj == null) curMainSubj = "word";

var element = document.getElementsByClassName("side-nav__item--active");
getTopic();
showTopic();

function getTopic() {
  var selFile = "./data/all_topics.csv";

  var read = new XMLHttpRequest();
  read.open("GET", selFile, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();
  var displayName = read.responseText;
  var topicArr = displayName.replace(/\r\n/g, "\n").split("\n");
  let topicCnt = topicArr.length;
  let tmpCnt = 0;

  let tmpArr = [];
  let k = 0;
  for (let k = 0; k < topicCnt; k++) {
    if (topicArr[k].length > 1 && topicArr[k][0] != "#")
      tmpArr.push(topicArr[k]);
  }
  topicArr = tmpArr;
  topicCnt = topicArr.length;

  //2.generate topic
  var i;
  var j;
  for (i = 0; i < topicCnt; i++) {
    var singTopicArr = topicArr[i].split(",");
    let topic = new Topic();
    topic.numb = i + 1;
    topic.course = singTopicArr[0];
    topic.main_subj = singTopicArr[1];
    topic.open_course_cnt = singTopicArr[2];
    topic.mid_subj = singTopicArr[3];
    topic.mid_explain = singTopicArr[4];
    topic.quiz_type = singTopicArr[5];

    for (j = 6; j < singTopicArr.length; j += 2) {
      topic.small_subjs.push(singTopicArr[j]);
      topic.small_subj_explains.push(singTopicArr[j + 1]);
      if (j + 2 < singTopicArr.length) {
        if (singTopicArr[j + 2].startsWith("http")) {
          topic.small_subj_html.push(singTopicArr[j + 2]);
          j += 1;
        } else {
          topic.small_subj_html.push("NA");
        }
      } else {
        topic.small_subj_html.push("NA");
      }
    }
    topics[i] = topic;
  }
}

function showTopic() {
  // 1. show main_subj view
  var i;
  var curSubj;
  var first = topic_view.firstElementChild;
  while (first) {
    first.remove();
    first = topic_view.firstElementChild;
  }

  var first_subj = subject_view.firstElementChild;
  while (first_subj) {
    first_subj.remove();
    first_subj = subject_view.firstElementChild;
  }

  var bCourse = false;

  curMainSubj = localStorage.getItem(curCourse + "_main_subj");

  for (i = 0; i < topics.length; i++) {
    if (topics[i].course != curCourse) continue;
    var curFigure = document.createElement("figure");

    // if (topics[i].main_subj == curMainSubj) continue;
    if (
      bCourse == false ||
      (i > 0 && topics[i - 1].main_subj != topics[i].main_subj)
    ) {
      bCourse = true;
      // var curFigure = document.createElement("figure");
      if (topics[i].main_subj != curMainSubj)
        curFigure.setAttribute("class", "main_subj__item");
      else
        curFigure.setAttribute(
          "class",
          "main_subj__item main_subj__item--active"
        );

      // curFigure.setAttribute("id", topics[i].main_subj);

      var curImg = document.createElement("img");
      curImg.setAttribute(
        "src",
        "img/empty_book_128_" + topics[i].main_subj + ".png"
      );
      curImg.setAttribute("class", "main_subj__photo");
      curImg.setAttribute("id", topics[i].main_subj);
      curSubj = topics[i].main_subj;

      curFigure.appendChild(curImg);
      // topic_view.appendChild(curFigure);
    }
    topic_view.appendChild(curFigure);

    // 2. show mid_subj view
    if (topics[i].main_subj != curMainSubj) continue;
    var curDetail = document.createElement("detail");
    curDetail.setAttribute("class", "detail");

    // 2.1. curDetailLeft
    var curDetailLeft = document.createElement("detail-left-side");
    curDetailLeft.setAttribute("class", "detail-left-side");

    var curDetailLeftImg = document.createElement("img");
    curDetailLeftImg.setAttribute("class", "category");
    curDetailLeftImg.setAttribute("src", "img/hangul_writing.png");

    var curDetailMidSbj = document.createElement("detail_mid_subj");
    curDetailMidSbj.setAttribute("class", "detail_mid_subj");
    curDetailMidSbj.innerText = topics[i].mid_explain;

    curDetailLeft.appendChild(curDetailLeftImg);
    curDetailLeft.appendChild(curDetailMidSbj);

    // 2.2. curDetailRight
    var curDetailRight = document.createElement("detail-right-side");
    curDetailRight.setAttribute("class", "detail-right-side");
    curProcCnt = 0;
    for (j = 0; j < topics[i].small_subjs.length; j++) {
      var curButton = document.createElement("button");
      var c, r, t;

      t = document.createElement("table");

      //1.test button
      r = t.insertRow(0);
      c = r.insertCell(0);
      var curBaseID =
        topics[i].quiz_type +
        "-" +
        topics[i].course +
        "_" +
        topics[i].main_subj +
        "_" +
        topics[i].mid_subj +
        "_" +
        topics[i].small_subjs[j];

      curButton.setAttribute("class", "test-button");
      curButton.setAttribute("background-color", "lightblue");
      curButton.setAttribute("id", curBaseID);
      if (curProcCnt >= topics[i].open_course_cnt) {
        curButton.innerText = "🔒";
        curButton.disabled = true;
      } else {
        if (topics[i].small_subj_explains[j].includes("\\")) {
          curButton.innerText =
            topics[i].small_subj_explains[j].split("\\")[0] +
            "\n" +
            topics[i].small_subj_explains[j].split("\\")[1];
        } else curButton.innerText = topics[i].small_subj_explains[j];

        // alert(curButton.innerText);
        // curButton.innerText = "1.1.1  \n節省";
      }

      var tmpLevel = getStarLevel(curButton.id);
      if (tmpLevel >= 3) {
        curButton.setAttribute("class", "test-button test-finish");
        curButton.innerText += "😃";
      } else if (tmpLevel > 0) {
        curButton.setAttribute("class", "test-button test-no-pass");
      } else curProcCnt++;

      c.appendChild(curButton);

      //2. wrong button
      var curWrongStorage;

      curWrongStorage = localStorage.getItem(curBaseID + "_wrong");

      if (
        curProcCnt < topics[i].open_course_cnt &&
        topics[i].main_subj != "game" &&
        topics[i].main_subj != "advanced"
      ) {
        if (
          curWrongStorage != null &&
          curWrongStorage != "undefined" &&
          curWrongStorage.length > 2
        ) {
          curButton = document.createElement("button");
          r = t.insertRow(1);
          c = r.insertCell(0);

          curButton.setAttribute("id", curBaseID + "wrong");

          c.appendChild(curButton);

          curButton.setAttribute("class", "wrong-button test-wrong");
          curButton.innerText = "錯題";
          c.appendChild(curButton);
        }

        // else {
        //   curButton.setAttribute("class", "wrong-button test-no-pass");
        //   curButton.innerText = "全題";
        // }
      }

      //3. star
      r = t.insertRow(1);
      c = r.insertCell(0);
      c.setAttribute("style", "text-align:center");

      var tmpMessage = "";

      var k;

      if (
        curProcCnt < topics[i].open_course_cnt &&
        topics[i].main_subj != "game" &&
        topics[i].main_subj != "advanced"
      ) {
        var curClassID = curBaseID + "_class";
        if (topics[i].small_subj_html[j].startsWith("http")) {
          tmpMessage =
            '<button  onclick="location.href =' +
            "'" +
            topics[i].small_subj_html[j] +
            "'" +
            '"' +
            'class="class-button id ="" ' +
            curClassID +
            ">課程 </button><span style='color:blue;'>";
        }

        tmpMessage += "<span style='color:blue;'>";
        for (k = 0; k < tmpLevel; k++) {
          tmpMessage += "★";
        }
        for (; k < 3; k++) {
          tmpMessage += "✩";
        }
        tmpMessage += "</span>";
        c.innerHTML = tmpMessage;
      }

      // curDetailRight.appendChild(curButton);
      curDetailRight.appendChild(t);
    }

    // 2.X. curDetail
    curDetail.appendChild(curDetailLeft);
    curDetail.appendChild(curDetailRight);
    subject_view.appendChild(curDetail);
  }
}

function getStarLevel(tmpQuiz) {
  var i;
  var curLevelStorage;

  for (i = 3; i > 0; i--) {
    curLevelStorage = localStorage.getItem(curCourse + "_level_" + i);

    if (
      curLevelStorage == null ||
      curLevelStorage == "undefined" ||
      curLevelStorage.length < 2
    ) {
      prevLevelStorage = curLevelStorage;
      continue;
    }
    if (curLevelStorage.includes(tmpQuiz + ";")) {
      break;
    }
  }

  return i;
}
