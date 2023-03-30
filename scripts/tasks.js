import navbar from "../components/navbar.js";

document.querySelector("#navbar").innerHTML = navbar();

// https://task-planner-backend-production.up.railway.app
const commonUrl = "http://localhost:8080";

let taskFormButtonOpen = document.getElementById("taskFormButtonOpen");
let taskFormButtonClose = document.getElementById("taskFormButtonClose");
let taskFormPost = document.getElementById("taskFormPost");
let postFormDiv = document.getElementById("postFormDiv");

taskFormButtonOpen.addEventListener("click", () => {
  taskFormButtonOpen.style.display = "none";
  taskFormButtonClose.style.display = "block";
  taskFormPost.style.display = "flex";
  taskFormPost.style.flexDirection = "column";
  postFormDiv.style.display = "block";
});

taskFormButtonClose.addEventListener("click", () => {
  taskFormButtonOpen.style.display = "block";
  taskFormButtonClose.style.display = "none";
  taskFormPost.style.display = "none";
  postFormDiv.style.display = "none";
});

// To get task data after creating task.

const createTask = async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let taskType = formData.get("taskType");
  let taskDescription = formData.get("taskDescription");
  let taskStatus = formData.get("taskStatus");
  let taskPriority = formData.get("taskPriority");
  let taskComment = formData.get("taskComment");

  let taskObject = {
    type: "someType",
    description: "someDescription",
    status: "enumValue1",
    priority: "enumValue2",
    comment: "someComment",
  };

  taskObject.type = taskType;
  taskObject.description = taskDescription;
  taskObject.status = taskStatus;
  taskObject.priority = taskPriority;
  taskObject.comment = taskComment;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskObject),
  };

  fetch(commonUrl + "/tasks/create", options)
    .then((response) => response.json())
    .then((taskObject) => {
      if (taskObject.description == "Validation error") {
        window.alert(taskObject.details);
      } else {
        window.alert(`Task created with Id : ${taskObject.taskId}`);
        taskFormPost.reset(); // reset the form fields
        main();
      }
    })
    .catch((error) => console.error(error));
};

taskFormPost.addEventListener("submit", createTask);

async function main() {
  try {
    let arrayOfTasks = await getAllTasksWithoutSprint();
    // console.log("arrayOfTasks:", arrayOfTasks);
    append(arrayOfTasks);
  } catch (error) {
    console.error("error:", error);
  }
}

main();

function append(arrayOfTasks) {
  let tableBody = document.getElementById("task-list");
  tableBody.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = task.taskId;
    row.appendChild(idCell);

    const typeCell = document.createElement("td");
    typeCell.textContent = task.type;
    row.appendChild(typeCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = task.description;
    row.appendChild(descriptionCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = task.status;
    row.appendChild(statusCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = task.priority;
    row.appendChild(priorityCell);

    const commentCell = document.createElement("td");
    commentCell.textContent = task.comment;
    row.appendChild(commentCell);

    const userDetailsCell = document.createElement("td");
    getUserByTaskId(task.taskId).then((username) => {
      if (username) {
        userDetailsCell.textContent = username;
        userDetailsCell.style.color = "GREEN";
      } else {
        userDetailsCell.textContent = "Not Assigned";
        userDetailsCell.style.color = "RED";
      }
    });
    row.appendChild(userDetailsCell);

    const sprintBlock = document.createElement("td");
    const sprintCell = document.createElement("input");
    sprintCell.setAttribute("class", "inputButton");
    sprintCell.setAttribute("type", "number");
    sprintCell.setAttribute("placeholder", "Sprint info");
    sprintCell.innerText = "Sprint info";

    const setSprintButton = document.createElement("button");
    setSprintButton.setAttribute("class", "inputButton");
    setSprintButton.textContent = "Add to Sprint";
    setSprintButton.style.backgroundColor = "skyblue";
    sprintBlock.append(sprintCell, setSprintButton);
    row.appendChild(sprintBlock);

    setSprintButton.addEventListener("click", () => {
      let sprintCellInfo = sprintCell.value;
      if (!sprintCellInfo) {
        window.alert(`Enter sprintId to continue...`);
      } else {
        // console.log("Button clicked!");
        addTaskToSprint(task.taskId, sprintCellInfo);
      }
    });

    const userBlock = document.createElement("td");
    const userCell = document.createElement("input");
    userCell.setAttribute("class", "inputButton");
    userCell.setAttribute("type", "number");
    userCell.setAttribute("placeholder", "User info");
    userCell.innerText = "User info";

    const setUserButton = document.createElement("button");
    setUserButton.setAttribute("class", "inputButton");
    setUserButton.textContent = "Assign user.";
    setUserButton.style.backgroundColor = "skyblue";
    userBlock.append(userCell, setUserButton);
    row.appendChild(userBlock);
    setUserButton.addEventListener("click", () => {
      console.log("User assign button clicked.");
      let userCellInfo = userCell.value;
      if (!userCellInfo) {
        window.alert(`Enter UserId to continue...`);
      } else if (userDetailsCell.innerText != "Not Assigned") {
        window.alert(`User already assigned.`);
      } else {
        assignTaskToUser(task.taskId, userCellInfo);
      }
    });
    tableBody.appendChild(row);
  });
}

function addTaskToSprint(taskId, sprintCellInfo) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  };

  fetch(
    commonUrl + `/sprints/assignTaskToSprint/${taskId}/${sprintCellInfo}`,
    options
  )
    .then((response) => {
      console.log("response:", response);
      console.log("response.status:", response.status);
      let data = response.json();
      if (response.status == 200) {
        main();
        window.alert(`Task : ${taskId} added to Sprint : ${sprintCellInfo}`);
      } else if (response.status == 400) {
        window.alert(
          `Oops...!!! Wrong SprintId check again. ${sprintCellInfo}`
        );
      }
      console.log("data:", data);
    })
    .catch((error) => console.error(error));
}

function assignTaskToUser(taskId, userId) {
  fetch(commonUrl + `/users/assignTaskToUser/${userId}/${taskId}`, {
    method: "POST",
  })
    .then((response) => {
      console.log("response:", response);
      console.log("response.status:", response.status);
      if (response.status == 200) {
        main();
        window.alert(`Task ${taskId} assigned to user ${userId}.`);
      } else if (response.status == 400) {
        window.alert(`Oops...!!! Wrong userId ${userId}.`);
      }
    })
    .catch((error) => console.log("error:", error));
}

async function getUserByTaskId(taskId) {
  let response = await fetch(commonUrl + `/tasks/user/${taskId}`, {
    method: "GET",
  });
  if (response.status == 200) {
    let data = await response.json();
    return data.name;
  } else {
  }
}

// Getting all tasks which does not belongs to any Sprint.
async function getAllTasksWithoutSprint() {
  let response = await fetch(commonUrl + "/tasks/withoutSprint");
  if (response.status == 200) {
    console.log("getAllTasksWithoutSprint response ok.");
    let data = await response.json();
    return data;
  }
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
}

async function getAllTasksWithoutSprintSortByPriority(priority) {
  let response = await fetch(commonUrl + `/tasks/withoutSprint/${priority}`);
  if (response.status == 200) {
    let data = await response.json();
    append(data);
  } else if (!response.ok) {
    throw new Error("Network response was not ok" + response.status);
  }
}

let prioritySelectSort = document.getElementById("prioritySelectSort");
prioritySelectSort.addEventListener("change", () => {
  if (prioritySelectSort.value == "HIGH" || prioritySelectSort.value == "LOW") {
    getAllTasksWithoutSprintSortByPriority(prioritySelectSort.value);
  } else {
    main();
  }
});
