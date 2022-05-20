// declaring global variables

let player1 = "Player1";
let player2 = "Player2";

let buttonPressed = false; // answer button pressed.
let setBounce = false; // if user sets bounce to on, the question is bounced once, if the answer is wrong.
let questionNum = 0; // number of the current question.
let totalQuestions = 15; // total of questions chosen is settings.
let players = 2; // number of players.
let subj = 0; // subject chosen for the questions.
let difficulty = 0;
let bounceDone = false;
let onBounce = false;
let torn = 1; // player asked to answer
let submitPressed = false;
let currentPlayer = player1;
let titleBounce = document.getElementById("titlebounce");
let game = {};
let questionText = document.getElementById('question-text');
let answer = document.getElementsByName('radio');
let answer1 = document.getElementById('answer1');
let answer2 = document.getElementById('answer2');
let answer3 = document.getElementById('answer3');
let answer4 = document.getElementById('answer4');
let correctAnswer = 0;
let chosenAnswer = 0;
let randomIndex = 0;
let gotToken = false;
let gotQuestions = false;
let data = {};     // object got from API (questions and answers)
let token = 0;
let points = 0;   // points gained in each question (1 or 0);
let player1Score = 0;
let player1TotalQuestions = 1;
let player2TotalQuestions = 0;
let player2Score = 0;
let winnerPlayer = 0;
let winnerScore = 0;
let winnerTotalQuestions = 0;
let looserPlayer = 0;
let looserScore = 0;
let looserTotalQuestions = 0;


//------------------------------------------------------------------------------------------
// Calling to game function

start(); // hides settings screen, collects settings data and initializes game

//------------------------------------------------------------------------------------------
// declaring game functions


function start() {  // hides settings screen, collects settings data and initializes game

  let button = document.querySelector(".button");

  button.addEventListener("click", () => {
    // when user clicks button, settings window is closed and data from it is collected and packed in an object called game.

    document.getElementById("settings").style.display = "none";

    let playersNum = document.getElementsByName("playersNum");
    player1 = currentPlayer = document.getElementById("player1").value;
    player2 = document.getElementById("player2").value;
    let questions = document.getElementsByName("questionsNum");
    let subjlist = document.getElementsByName("subjects");
    let difficulty = document.getElementsByName("difficulty");
    let getbounce = document.getElementsByName("bounce");

    playersNum[0].checked
     ? (players = 1)
     : (players = 2);

     questions[0].checked
      ? (totalQuestions = 10)
      : questions[1].checked
      ? (totalQuestions = 30)
      : (totalQuestions = 50);

    subjlist[0].checked
    ? (subj = 27)
    : subjlist[1].checked
    ? (subj = 17)
    : subjlist[2].checked
    ? (subj = 18)
    : subjlist[3].checked
    ? (subj = 23)
    : subjlist[4].checked
    ? (subj = 22)
    : (subj = 9)

    difficulty[0].checked
      ? (difficulty = 'easy')
      : difficulty[1].checked
      ? (difficulty = 'medium')
      : (difficulty = 'hard')

    getbounce[0].checked
     ? (setBounce = true)
     : (setBounce = false);

    game = {
      players: players,
      totalQuestions: totalQuestions,
      subj: subj,
      difficulty: difficulty,
      setBounce: setBounce,
      player1: player1,
      player2: player2,
      currentPlayer: currentPlayer,
      onBounce: onBounce
    }
    play();
  });
}

function play() {

  if (questionNum <= totalQuestions) {
    if (questionNum > 0) {
      getAnswer(); // compares given answer with the correct one.
    }
    getQuestions();
    displayScreen();
    if (players == 2 && onBounce == false) {
      torn = setTorn();
    }
  }
}
function getAnswer() {
  let checkCorrect = document.getElementById(checkcorrect);
  let correctAnswer = document.getElementById(correctanswer);

  answer[0].checked
    ? (chosenAnswer = 0)
    : answer[1].checked
    ? (chosenAnswer = 1)
    : answer[2].checked
    ? (chosenAnswer = 2)
    : (chosenAnswer = 3);

  if (chosenAnswer == randomIndex){
    points = 1;
    onBounce = false;
    showright();
  } else {
    points = 0;
    showwrong();
    if (setBounce && players ==2){
      bouncing();
    }
    }
  score(currentPlayer, points); // actualizes scores and rates.
}

function score(currentPlayer, points) {

    if (torn ==1){ player1Score= player1Score + points}
    else { player2Score = player2Score + points}

    let player1ScoreNumber = document.getElementById('player1-score-number');
    let player2ScoreNumber = document.getElementById('player2-score-number');
    player1ScoreNumber.innerText = player1Score;
    player2ScoreNumber.innerText = player2Score;
    let player1RateProgress = document.getElementById('player1-rate');
    let player2RateProgress = document.getElementById('player2-rate');
    player1RateProgress.innerText = player1Score + '/'+ player1TotalQuestions;
    player2RateProgress.innerText = player2Score + '/'+ player2TotalQuestions;

    let player1RateBar = document.getElementById('player1-rate-progress');
    let player2RateBar= document.getElementById('player2-rate-progress');
    player1RateBar.setAttribute('value', Math.floor(player1Score*100/player1TotalQuestions));
    player2RateBar.setAttribute('value', Math.floor(player2Score*100/player2TotalQuestions));
}

async function getQuestions() {
    
  if (onBounce == false) {                          // when bouncing the question is not changed, so the other player can have a chance.
    questionNum++;
  }
  if (questionNum >= totalQuestions) {
    setTimeout(finish(), 1500);
    return;
  }
    if (!gotQuestions){
    if (!gotToken){
    const tokenJson = await fetch(                          //gets token from API server.
      'https://opentdb.com/api_token.php?command=request',
      {method: 'GET'}
    );
    token = await tokenJson.json();
    gotToken = true;
    }
    const response = await fetch(                           // gets questions fron API server.
      'https://opentdb.com/api.php?amount=' + game.totalQuestions + '&category=' + subj + '&difficulty=' + game.difficulty + '&type=multiple&token=' + token.token,
      {method: 'GET'}
    );

    data = await response.json();
    gotQuestions = true;
    }
  //display question
  let backgroundImages = {
    27: 'url(img/animal.jpg)',
    17: 'url(img/science.jpg)',
    19: 'url(img/math.jpg)',
    18: 'url(img/computer.jpg)',
    23: 'url(img/history.jpg)',
    20: 'url(img/mithology.jpg)',
    22: 'url(img/geography.jpg)',
    9: 'url(img/any.jpg)'
  }
  let background = document.getElementById('background');
  background.style.backgroundImage = backgroundImages[subj];
  questionText.innerText = data.results[questionNum-1].question;
    if (!onBounce){
    randomIndex = Math.floor(Math.random()*(4));
    let multipleChoice = data.results[questionNum-1].incorrect_answers;
    correctAnswer = data.results[questionNum-1].correct_answer;
    multipleChoice.splice(randomIndex, 0, correctAnswer);
    answer1.innerText = multipleChoice[0];
    answer2.innerText = multipleChoice[1];
    answer3.innerText = multipleChoice[2];
    answer4.innerText = multipleChoice[3];
    }
  }

// display player, number of question, total of questions, and difficulty.
function displayScreen() {

  // set active player
  let titleplayer = document.getElementById("titleplayer");
  titleplayer.innerText = `Player #${torn}, ` + currentPlayer;

  // display 'question #/totalQuestions'
  let questiontitle = document.getElementById("questiontitle");
  questiontitle.innerText =`Question #${questionNum}, out of ` + totalQuestions;

    // display player1's name
  let player1name = document.getElementById("player1name");
  let titles = document.getElementById("titles");
  player1name.innerText = player1;

  // display player2's name
  if (currentPlayer == player2) {
    titles.style.flexDirection = "row-reverse";
  } else {
    titles.style.flexDirection = "row";
  }
  let player2name = document.getElementById("player2name");
  player2name.innerText = player2;

  if (onBounce == false) {
    titleBounce.style.display = "none";
    questiontitle.style.color = "black";
    titleplayer.style.color = "black";
  }
}
// set whose torn it is.
function setTorn() {
  if (torn == 1) {
    currentPlayer = player2;
    player2TotalQuestions ++;
    return 2;
  }
  if (torn == 2) {
    currentPlayer = player1;
    player1TotalQuestions ++;
    return 1;
  }
}
function showright(){
  document.getElementById("wrong").style.display = "none";
  document.getElementById("correct").style.display = "flex";
  document.getElementById("correctanswer").style.visibility = "hidden";
  document.getElementById("righttext").style.visibility = "hidden";
}
function showwrong(){
  document.getElementById("correct").style.display = "none";
  document.getElementById("wrong").style.display = "flex";

if (onBounce || players == 1){
  document.getElementById("correctanswer").style.visibility = "visible";
  document.getElementById("righttext").style.visibility = "visible";
  document.getElementById("righttext").innerText = correctAnswer;
}
}
function bouncing() {   //shows same question to the other player
  onBounce = !onBounce;

  // display bounce
  titleplayer.style.color = "red";
  titleBounce.style.display = "flex";
}

function finish() {  // shows the final scores on another over-screen.

  document.getElementById("final").style.display = "flex";
  let winner = document.getElementById('winner');
  let winnerData = document.getElementById('winner-data');
  let looserData = document.getElementById('looser-data');
  if (player2Score == player1Score){
    winner.innerText = 'There is a draw!!'
    return;
  } else if (player2Score>player1Score){
    winnerPlayer = player2;
    looserPlayer = player1;
    winnerScore = player2Score;
    looserScore = player1Score;
    winnerTotalQuestions = player2TotalQuestions;
    looserTotalQuestions = player1TotalQuestions;
  } else if (player1Score>player2Score){
    winnerPlayer = player1;
    looserPlayer = player2;
    winnerScore = player1Score;
    looserScore = player2Score;
    winnerTotalQuestions = player1TotalQuestions;
    looserTotalQuestions = player2TotalQuestions;
  }
  winner.innerText = winnerPlayer + ' won.';
  winnerData.innerText = 'Points: '+ winnerScore + '. Rate: ' + Math.floor(winnerScore*100/winnerTotalQuestions) + '%';
  looser.innerText = looserPlayer + ':';
  looserData.innerText = 'Points: '+ looserScore + '. Rate: ' + Math.floor(looserScore*100/looserTotalQuestions) + '%';

  let reloadButton = document.getElementById('reloadbutton');
  reloadButton.addEventListener("click", ()=>document.location.reload(true));
}
