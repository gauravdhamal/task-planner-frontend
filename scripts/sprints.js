import navbar from "../components/navbar.js";

document.querySelector("#navbar").innerHTML = navbar();

// https://task-planner-backend-production.up.railway.app
const commonUrl = "http://localhost:8080";

let sprintFormButtonOpen = document.getElementById("sprintFormButtonOpen");
let sprintFormButtonClose = document.getElementById("sprintFormButtonClose");
let sprintForm = document.getElementById("sprintForm");

sprintFormButtonOpen.addEventListener("click", () => {
  sprintFormButtonOpen.style.display = "none";
  sprintFormButtonClose.style.display = "block";
  sprintForm.style.display = "block";
});

sprintFormButtonClose.addEventListener("click", () => {
  sprintFormButtonOpen.style.display = "block";
  sprintFormButtonClose.style.display = "none";
  sprintForm.style.display = "none";
});

// To get the sprint object after creating sprint.

const createSprint = async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let name = formData.get("sprint-name");
  let startDate = formData.get("sprint-startdate");
  let endDate = formData.get("sprint-enddate");

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
      console.log("sprintObject:", sprintObject);
      window.alert("Sprint created note sprintId : " + sprintObject.sprintId);
    })
    .catch((error) => console.error(error));
};

sprintForm.addEventListener("submit", createSprint);
