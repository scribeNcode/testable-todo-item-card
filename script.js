
/*
 CONFIGURATION & CONSTANTS
 */
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/*
 PURE LOGIC FUNCTIONS
 */
const getStatusMessage = (dueDate) => {
  const now = new Date();
  const diffInMs = dueDate - now;
  const diffInHours = Math.floor(diffInMs / MS_PER_HOUR);
  const diffInDays = Math.ceil(diffInMs / MS_PER_DAY);

  if (diffInMs < 0) return `Overdue by ${Math.abs(diffInHours)} hours`;
  if (diffInMs < 1000 * 60) return "Due now!";
  if (diffInHours < 24 && diffInDays === 0) return "Due later today";
  if (diffInDays === 1) return "Due tomorrow";
  
  return `Due in ${diffInDays} days`;
};

/*
UI/DOM ORCHESTRATION
 */
const elements = {
  editBtn: document.getElementById("edit-btn"),
  deleteBtn: document.getElementById("delete-btn"),
  timeRemaining: document.getElementById("time-remaining"),
  projectTitle: document.getElementById("project-title"),
  status: document.getElementById("todo-status"),
  checkbox: document.getElementById("complete-checkbox"),
};

const updateUI = (isComplete, dueDate) => {
  const { projectTitle, timeRemaining, status } = elements;
  
  if (isComplete) {
    projectTitle.classList.add("strike-through");
    timeRemaining.textContent = "Done";
    status.textContent = "Done";
  } else {
    projectTitle.classList.remove("strike-through");
    timeRemaining.textContent = getStatusMessage(dueDate);
    status.textContent = "Pending";
  }
};

/*
 EVENT INITIALIZATION
 */
const initApp = () => {
  const targetDate = new Date("2026-04-20T12:00:00");

  // Simple logging listeners
  elements.editBtn.addEventListener("click", (e) => (e.preventDefault(), console.log("edit")));
  elements.deleteBtn.addEventListener("click", (e) => (e.preventDefault(), console.log("delete")));

  // Checkbox logic
  elements.checkbox.addEventListener("change", (e) => {
    updateUI(e.target.checked, targetDate);
  });

  // Initial render
  updateUI(elements.checkbox.checked, targetDate);
};

initApp();