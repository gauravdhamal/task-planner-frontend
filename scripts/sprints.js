import navbar from "../components/navbar.js";

document.querySelector("#navbar").innerHTML = navbar();

const commonUrl = "http://localhost:8080";
// const commonUrl = "https://task-planner-backend-production.up.railway.app";

let sprintFormButtonOpen = document.getElementById("sprintFormButtonOpen");
let sprintFormButtonClose = document.getElementById("sprintFormButtonClose");
let sprintFormPost = document.getElementById("sprintFormPost");
let postFormDiv = document.getElementById("postFormDiv");

sprintFormButtonOpen.addEventListener("click", () => {
  sprintFormButtonOpen.style.display = "none";
  sprintFormButtonClose.style.display = "block";
  sprintFormPost.style.display = "flex";
  sprintFormPost.style.flexDirection = "column";
  postFormDiv.style.display = "block";
});

sprintFormButtonClose.addEventListener("click", () => {
  sprintFormButtonOpen.style.display = "block";
  sprintFormButtonClose.style.display = "none";
  sprintFormPost.style.display = "none";
  postFormDiv.style.display = "none";
});

// Tasks close button code.
let closeTasks = document.getElementById("closeTasks");
let viewTasks = document.getElementById("viewTasks");
closeTasks.addEventListener("click", () => {
  viewTasks.style.display = "none";
});

// To get the sprint object after creating sprint.
const createSprint = async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let name = formData.get("sprintName");
  let startDate = formData.get("sprintStartdate");
  let endDate = formData.get("sprintEnddate");

  let sprintObject = {
    name,
    startDate,
    endDate,
  };

  sprintObject.name = name;
  sprintObject.startDate = startDate;
  sprintObject.endDate = endDate;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sprintObject),
  };

  fetch(commonUrl + "/sprints/create", options)
    .then((response) => response.json())
    .then((sprintObject) => {
      if (sprintObject.description == "Validation error") {
        window.alert(sprintObject.details);
      } else {
        window.alert("Sprint created note sprintId : " + sprintObject.sprintId);
        sprintFormPost.reset();
        main();
      }
    })
    .catch((error) => console.error(error));
};

sprintFormPost.addEventListener("submit", createSprint);

async function getAllSprints() {
  let response = await fetch(commonUrl + `/sprints/all`);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  }
}

async function getAllTasksBySprintId(sprintId) {
  let response = await fetch(commonUrl + `/sprints/tasks/${sprintId}`);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  } else {
    window.alert(`No any tasks found for sprint ${sprintId}`);
  }
}

async function main() {
  let arrayOfSprints = await getAllSprints();
  appendSprints(arrayOfSprints);
}

main();

let appendSprints = (arrayOfSprints) => {
  const sprintTableBody = document.querySelector("#sprintTable tbody");
  sprintTableBody.innerHTML = "";
  arrayOfSprints.forEach((sprint) => {
    const tr = document.createElement("tr");
    const tdSprintId = document.createElement("td");
    const tdName = document.createElement("td");
    const tdStartDate = document.createElement("td");
    const tdEndDate = document.createElement("td");
    const tdTasks = document.createElement("td");
    const taskButton = document.createElement("button");
    taskButton.textContent = "Open";
    taskButton.setAttribute("class", "inputButton");
    taskButton.style.backgroundColor = "skyblue";
    taskButton.addEventListener("click", () => {
      getAllTasksBySprintId(sprint.sprintId).then((tasks) => {
        if (tasks != undefined) {
          viewTasks.style.display = "block";
          appendTasksPerSprint(tasks);
        }
      });
    });

    tdSprintId.textContent = sprint.sprintId;
    tdName.textContent = sprint.name;
    tdStartDate.textContent = sprint.startDate;
    tdEndDate.textContent = sprint.endDate;
    tdTasks.appendChild(taskButton);

    tr.appendChild(tdSprintId);
    tr.appendChild(tdName);
    tr.appendChild(tdStartDate);
    tr.appendChild(tdEndDate);
    tr.appendChild(tdTasks);

    sprintTableBody.appendChild(tr);
  });
};

let appendTasksPerSprint = (tasks) => {
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
