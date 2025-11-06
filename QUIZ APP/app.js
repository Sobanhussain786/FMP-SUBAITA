// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpc8V6ZcUbrTQ9hP0AXe0mrnt2Kzkl-mQ",
  authDomain: "quiz-application-67d44.firebaseapp.com",
  projectId: "quiz-application-67d44",
  storageBucket: "quiz-application-67d44.firebasestorage.app",
  messagingSenderId: "523393728636",
  appId: "1:523393728636:web:56d27ef8d3ffcab857c9f9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();


var questions = [
      {question:"HTML stands for?", option1:"Hyper Text Markup Language", option2:"Hyper Tech Markup Language", option3:"Hyper Touch Markup Language", corrAnswer:"Hyper Text Markup Language"},
      {question:"CSS stands for?", option1:"Cascoding Style Sheets", option2:"Cascading Style Sheets", option3:"Cascating Style Sheets", corrAnswer:"Cascading Style Sheets"},
      {question:"Largest heading tag?", option1:"<h6>", option2:"<h3>", option3:"<h1>", corrAnswer:"<h1>"},
      {question:"Which tag gives unique identity?", option1:"id", option2:"class", option3:"label", corrAnswer:"id"},
      {question:"CSS id selector symbol?", option1:"#", option2:".", option3:"@", corrAnswer:"#"},
      {question:"CSS class selector symbol?", option1:"#", option2:".", option3:"@", corrAnswer:"."},
      {question:"Which tag is used to insert image?", option1:"<img>", option2:"<src>", option3:"<image>", corrAnswer:"<img>"},
      {question:"HTML is what type of language?", option1:"Programming", option2:"Markup", option3:"Styling", corrAnswer:"Markup"},
      {question:"Which attribute is used for inline style?", option1:"style", option2:"css", option3:"class", corrAnswer:"style"},
      {question:"CSS can be added by how many methods?", option1:"2", option2:"3", option3:"4", corrAnswer:"3"},
      {question:"Which property changes background color?", option1:"color", option2:"background-color", option3:"border", corrAnswer:"background-color"},
      {question:"<br> tag is used for?", option1:"line break", option2:"paragraph", option3:"bold text", corrAnswer:"line break"},
];

  var quesElement = document.getElementById("ques");
    var option1 = document.getElementById("opt1");
    var option2 = document.getElementById("opt2");
    var option3 = document.getElementById("opt3");
    var nextBtn = document.getElementById("btn");
    var index = 0;
    var score = 0;

    var min = 2;
    var sec = 0;
    var timerInterval;

var index = 0;
var score = 0;
var userAnswers = [];

    function startTimer(){
      clearInterval(timerInterval);
      min = 2;
      sec = 0;

      timerInterval = setInterval(function(){
        document.getElementById("time").innerHTML = min + ":" + (sec<10?"0"+sec:sec);
        sec--;
        if(sec < 0){
          min--;
          sec = 59;
        }
        if(min < 0){
          clearInterval(timerInterval);
          nextQuestion(); 
        }
      },1000);
    }

    function nextQuestion(){
      var allInputs = document.getElementsByTagName("input");

      if (index > 0) {
    var selectedOption = null;
    var isCorrect = false;

    for (var i = 0; i < allInputs.length; i++) {
      if (allInputs[i].checked) {
        var userValue = allInputs[i].value;
        selectedOption = questions[index - 1]["option" + userValue];
        if (selectedOption == questions[index - 1].corrAnswer) {
          isCorrect = true;
          score++;
        }
      }
      allInputs[i].checked = false;
    }

    userAnswers.push({
      question: questions[index - 1].question,
      correctAnswer: questions[index - 1].corrAnswer,
      result: isCorrect ? "✅ Correct" : "❌ Wrong"
    });
  }

      if(index >= questions.length){
        clearInterval(timerInterval);

    firebase.database().ref("quiz_results").push({
      score: score,
      answers: userAnswers
    });

 Swal.fire({
  title: "🎉 Quiz Completed!\nScore: " + score + " / " + questions.length + "\nPercentage: " + ((score / questions.length) * 100).toFixed(2) + "%",
  showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
 return; 
  }
  quesElement.innerText = questions[index].question;
  option1.innerText = questions[index].option1;
  option2.innerText = questions[index].option2;
  option3.innerText = questions[index].option3;
  nextBtn.disabled = true;
  index++;
  startTimer();
}
function trigger() {
  nextBtn.disabled = false;
}

nextQuestion();