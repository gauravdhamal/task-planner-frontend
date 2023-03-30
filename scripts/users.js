import navbar from "../components/navbar.js";

document.querySelector("#navbar").innerHTML = navbar();

// https://task-planner-backend-production.up.railway.app
const commonUrl = "http://localhost:8080";

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

    tdUserId.textContent = item.userId;
    tdName.textContent = item.name;
    tdUsername.textContent = item.username;
    tdRole.textContent = item.role;
    tdGender.textContent = item.gender;

    tr.appendChild(tdUserId);
    tr.appendChild(tdName);
    tr.appendChild(tdUsername);
    tr.appendChild(tdRole);
    tr.appendChild(tdGender);

    userTableBody.appendChild(tr);
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
