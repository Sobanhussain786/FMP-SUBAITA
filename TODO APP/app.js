const firebaseConfig = {
  apiKey: "AIzaSyBtmORLUbbERm5eB6h8d-YF8XfRp4JxRyc",
  authDomain: "todo-app-d1e22.firebaseapp.com",
  projectId: "todo-app-d1e22",
  storageBucket: "todo-app-d1e22.firebasestorage.app",
  messagingSenderId: "880057863717",
  appId: "1:880057863717:web:16f7864904f4ff4ce4b9cc"
};

// Initialize Firebase
const app =firebase.initializeApp(firebaseConfig);
var db = firebase.database();

firebase.database().ref("todos").push()


var userInput = document.getElementById("todoInput");
var todoList = document.getElementById("list");

function addTodo() {
  if (userInput.value === "") {
    alert("Empty Input");
  } else {
    var todoObj = {
      userText: userInput.value
    };
    var key = firebase.database().ref("todos").push().key;
    firebase.database().ref("todos/" + key).set(todoObj);
    createListItem(userInput.value, key);
    userInput.value = "";
  }
}

function createListItem(text, key) {
  var liElement = document.createElement("li");
  liElement.setAttribute("id", key);
  liElement.style.display = "flex";
  liElement.style.justifyContent = "space-between";
  liElement.style.alignItems = "center";
  liElement.style.padding = "10px";
  liElement.style.marginBottom = "8px";
  liElement.style.borderRadius = "5px";
  liElement.style.width = "300px";

  var liText = document.createTextNode(text);
  liElement.appendChild(liText);

  var btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "5px";

  var delBtn = document.createElement("button");
  delBtn.innerText = "Delete";
  delBtn.setAttribute("onclick", "deleteSingleItem('" + key + "')");
  delBtn.style.backgroundColor = "rgba(36, 34, 34, 0.63)";
  delBtn.style.color = "white";
  delBtn.style.padding = "5px 10px";
  delBtn.style.border = "none";
  delBtn.style.borderRadius = "4px";

  var editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.setAttribute("onclick", "editSingleItem('" + key + "')");
  editBtn.style.backgroundColor = "rgba(36, 34, 34, 0.63)";
  editBtn.style.color = "white";
  editBtn.style.padding = "5px 10px";
  editBtn.style.border = "none";
  editBtn.style.borderRadius = "4px";

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(delBtn);

  liElement.appendChild(btnContainer);
  todoList.appendChild(liElement);
}

function deleteSingleItem(key) {
  firebase.database().ref("todos/" + key).remove();
  document.getElementById(key).remove();
}

function editSingleItem(key) {
  var updatedValue = prompt("Enter updated value");
  if (updatedValue) {
    firebase.database().ref("todos/" + key).update({
      userText: updatedValue
    });
    document.getElementById(key).childNodes[0].data = updatedValue;
  }
}
function deleteAll() {
  firebase.database().ref("todos").remove();
  todoList.innerHTML = "";
}


var allTodos = {}; 

function getDataFromFireBase() {
  var ref = firebase.database().ref("todos");

  // Step 1: Page refresh par existing data load karo
  
function getAllTodoTask() {
  var ref = firebase.database().ref("todos");

  ref.once("value", function(data) {
    var allData = data.val();   
    todoList.innerHTML = "";

    if (allData) {
      for (var key in allData) {
        createListItem(allData[key].userText, key);
      }
    } else {
      console.log("No todos found!");
    }
  });
}


  // Step 2: Jab naya data add ho
  ref.on("child_added", function (data) {
    var key = data.key;
    allTodos[key] = data.val();

    // Agar item UI me already na ho to add karo
    if (!document.getElementById(key)) {
      createListItem(data.val().userText, key);
    }
    console.log("Added:", allTodos);
  });

  // Step 3: Jab data edit ho
  ref.on("child_changed", function (data) {
    var key = data.key;
    allTodos[key] = data.val();

    var li = document.getElementById(key);
    if (li) {
      li.childNodes[0].data = data.val().userText;
    }
    console.log("Updated:", allTodos);
  });

  //  Step 4: Jab data delete ho
  ref.on("child_removed", function (data) {
    var key = data.key;
    delete allTodos[key];

    var li = document.getElementById(key);
    if (li) li.remove();

    console.log("Deleted:", allTodos);
  });
}

getDataFromFireBase();
