import navbar from "../components/navbar.js";

document.querySelector("#navbar").innerHTML = navbar();

// const commonUrl = "http://localhost:8080";
const commonUrl = "https://task-planner-backend-production.up.railway.app";

let userFormButtonOpen = document.getElementById("userFormButtonOpen");
let userFormButtonClose = document.getElementById("userFormButtonClose");
let userForm = document.getElementById("userForm");
let postFormDiv = document.getElementById("postFormDiv");

userFormButtonOpen.addEventListener("click", () => {
  userFormButtonOpen.style.display = "none";
  userFormButtonClose.style.display = "block";
  postFormDiv.style.display = "block";
  userForm.style.display = "flex";
  userForm.style.flexDirection = "column";
});

userFormButtonClose.addEventListener("click", () => {
  userFormButtonOpen.style.display = "block";
  userFormButtonClose.style.display = "none";
  postFormDiv.style.display = "none";
});

// Tasks close button code.
let closeTasks = document.getElementById("closeTasks");
let viewTasks = document.getElementById("viewTasks");
closeTasks.addEventListener("click", () => {
  viewTasks.style.display = "none";
});

// To get user data after creating user.
const createUser = async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let name = formData.get("userName");
  let username = formData.get("userUsername");
  let password = formData.get("userPassword");
  let role = formData.get("userRole");
  let gender = formData.get("userGender");

  let userObject = {
    name: "someName",
    username: "someUsername",
    password: "somePassword",
    role: "enumValue1",
    gender: "enumValue2",
  };

  userObject.name = name;
  userObject.username = username;
  userObject.password = password;
  userObject.role = role;
  userObject.gender = gender;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObject),
  };

  fetch(commonUrl + "/users/create", options)
    .then((response) => response.json())
    .then((userObject) => {
      if (userObject.description == "Validation error") {
        window.alert(userObject.details);
      } else if (userObject.description == "uri=/users/create") {
        window.alert("Username already exists try with another one.");
      } else {
        // console.log("userObject:", userObject);
        window.alert(`User created with Id : ${userObject.userId}`);
        userForm.reset();
      }
    })
    .catch((error) => console.error("error : ", error));
};

userForm.addEventListener("submit", createUser);

async function getAllUsers() {
  let response = await fetch(commonUrl + "/users/all");
  if (response.status == 200) {
    let data = response.json();
    return data;
  } else {
    window.alert(`No any user found in database.`);
  }
}

async function getAllUserByGender(gender) {
  let response = await fetch(commonUrl + `/users/all/${gender}`);
  if (response.status == 200) {
    let data = await response.json();
    appendUsers(data);
  } else {
    window.alert(`No any users found to sort.`);
  }
}

async function getAllUsersSortByNames(value) {
  let response = await fetch(commonUrl + `/users/all/sortByName/${value}`);
  if (response.status == 200) {
    let data = await response.json();
    appendUsers(data);
  } else {
    window.alert(`No any users found to sort.`);
  }
}

async function getAllTasksByUserId(userId) {
  let response = await fetch(commonUrl + `/users/tasks/${userId}`);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  } else {
    window.alert(`No any tasks found for user ${userId}`);
  }
}

async function main() {
  let arrayOfUsers = await getAllUsers();
  appendUsers(arrayOfUsers);
}

main();

let appendUsers = (arrayOfUsers) => {
  const userTableBody = document.querySelector("#userTable tbody");
  userTableBody.innerHTML = "";
  arrayOfUsers.forEach((item) => {
    const tr = document.createElement("tr");
    const tdUserId = document.createElement("td");
    const tdName = document.createElement("td");
    const tdUsername = document.createElement("td");
    const tdRole = document.createElement("td");
    const tdGender = document.createElement("td");
    const tdTasks = document.createElement("td");
    const taskButton = document.createElement("button");
    taskButton.textContent = "Open";
    taskButton.setAttribute("class", "inputButton");
    taskButton.style.backgroundColor = "skyblue";
    taskButton.addEventListener("click", () => {
      getAllTasksByUserId(item.userId).then((tasks) => {
        if (tasks != undefined) {
          viewTasks.style.display = "block";
          appendTasksPerUser(tasks);
        }
      });
    });

    tdUserId.textContent = item.userId;
    tdName.textContent = item.name;
    tdUsername.textContent = item.username;
    tdRole.textContent = item.role;
    tdGender.textContent = item.gender;
    tdTasks.appendChild(taskButton);

    tr.appendChild(tdUserId);
    tr.appendChild(tdName);
    tr.appendChild(tdUsername);
    tr.appendChild(tdRole);
    tr.appendChild(tdGender);
    tr.appendChild(tdTasks);

    userTableBody.appendChild(tr);
  });
};

let appendTasksPerUser = (tasks) => {
  const tasksTableBody = document.getElementById("viewTasksTableBody");
  tasksTableBody.innerHTML = "";
  tasks.forEach((task) => {
    const tr = document.createElement("tr");

    const taskIdTd = document.createElement("td");
    taskIdTd.textContent = task.taskId;
    tr.appendChild(taskIdTd);

    const typeTd = document.createElement("td");
    typeTd.textContent = task.type;
    tr.appendChild(typeTd);

    const descriptionTd = document.createElement("td");
    descriptionTd.textContent = task.description;
    tr.appendChild(descriptionTd);

    const statusTd = document.createElement("td");
    statusTd.textContent = task.status;
    tr.appendChild(statusTd);

    const priorityTd = document.createElement("td");
    priorityTd.textContent = task.priority;
    tr.appendChild(priorityTd);

    const commentTd = document.createElement("td");
    commentTd.textContent = task.comment;
    tr.appendChild(commentTd);

    tasksTableBody.appendChild(tr);
  });
};

let selectGender = document.getElementById("selectGender");

selectGender.addEventListener("change", () => {
  let genderValue = selectGender.value;
  if (genderValue == "MALE" || genderValue == "FEMALE") {
    getAllUserByGender(genderValue);
  } else {
    main();
  }
});

let selectName = document.getElementById("selectName");

selectName.addEventListener("change", () => {
  let nameValue = selectName.value;
  if (nameValue == "ASC" || nameValue == "DESC") {
    getAllUsersSortByNames(nameValue);
  } else {
    main();
  }
});
