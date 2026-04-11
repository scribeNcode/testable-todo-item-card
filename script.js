document.getElementById("edit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("edit clicked");
});

document.getElementById("delete-btn").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("delete clicked");
});

// get current time
let now = new Date();

// get dueDate time
let dueDate = new Date("2026-04-20T12:00:00");

let diffInMilSec = dueDate - now;

// get diffInMin
let diffInMin = Math.floor(diffInMilSec / (1000 * 60));

// get diffInHour
let diffInHour = Math.floor(diffInMilSec / (1000 * 60 * 60));

// get diffInDay
let diffInDay = Math.ceil(diffInHour / 24);

let message = "";

if (diffInMilSec < 0) {
  let time = Math.abs(diffInHour);
  message = `Overdue by ${time} hours`;
} else if (diffInMin <= 0) {
  message = "Due now!";
} else if (diffInHour < 24 && diffInDay === 0) {
  message = "Due later today";
} else if (diffInDay === 1) {
  message = "Due tomorrow";
} else {
  message = `Due in ${diffInDay} days`;
}

// Update the Screen
document.getElementById("time-remaining").textContent = message;

//Complete button event
// get project title
const projectTitle = document.getElementById("project-title");

const checkbox = document.getElementById("complete-checkbox");

checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    projectTitle.classList.add("strike-through");
    document.getElementById("time-remaining").textContent = "completed";
  } else if (!e.target.checked) {
    projectTitle.classList.remove("strike-through");
    document.getElementById("time-remaining").textContent = message;
  }
});
