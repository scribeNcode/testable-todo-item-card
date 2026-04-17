//////////////    CONFIGURATION & CONSTANTS  //////////////////////////
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

///////////////    PURE LOGIC FUNCTIONS. ////////////////////////////
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

////////////////////////////  UI/DOM ORCHESTRATION /////////////////////////////
const elements = {
  editBtn: document.getElementById("edit-btn"),
  deleteBtn: document.getElementById("delete-btn"),
  timeRemaining: document.getElementById("time-remaining"),
  projectTitle: document.getElementById("project-title"),
  status: document.getElementById("todo-status"),
  checkbox: document.getElementById("complete-checkbox"),
  articleEle: document.getElementById("article-el"),
  formEl: document.getElementById("form"),
  cancelEl: document.getElementById("edit-cancelBtn"),
  editSaveBtn: document.getElementById("edit-saveBtn"),
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



///////////////////////////////////// EVENT INITIALIZATION /////////////////////////////
const initApp = () => {
  let dateValue = "2026-04-20T12:00:00";
  let targetDate = new Date(dateValue);

  // Simple logging listeners
  elements.editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // hide todo app
    elements.articleEle.style.display = "none";
    elements.formEl.style.display = "block";
  });

  elements.cancelEl.addEventListener("click", (e) => {
    e.preventDefault();
    // hide todo app
    elements.articleEle.style.display = "block";
    elements.formEl.style.display = "none";
  });

  elements.deleteBtn.addEventListener(
    "click",
    (e) => (e.preventDefault(), console.log("delete")),
  );

  // Checkbox logic
  elements.checkbox.addEventListener("change", (e) => {
    updateUI(e.target.checked, targetDate);
  });

  //////// save button event listener
  elements.editSaveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // get edited title and description
    handleSave();

    // when the save button is clicked
    document.getElementById("article-el").style.display = "block";
    document.getElementById("form").style.display = "none";
  });

  //////// Cancel button event listener
  elements.cancelEl.addEventListener("click", (e) => {
    e.preventDefault();
    // hide todo app
    elements.articleEle.style.display = "block";
    elements.formEl.style.display = "none";
  });

  // Initial render
  updateUI(elements.checkbox.checked, targetDate);




///////////////////////////////////////////////// HANDLERS ////////////////////////////////////////////////////////////////////
    function handleDescriptionChange() {
      let userEditDesc = document.getElementById("edit-description").value;
      if (userEditDesc.trim().length > 0) {
        let mainDesc = document.getElementById("description");
        mainDesc.textContent = userEditDesc;
      }
    }


  function handleSelect() {
    let priorityElement = document.getElementById("PriorityElement");
    const select = document.getElementById("edit-priority");

    select.addEventListener("change", (e) => {
      let userOption = e.target.value;
      if (userOption.trim().length > 0) {
        priorityElement.textContent = userOption;
      }
    });
  }

  function handleDate() {
    let editDateValue = document.getElementById("editDate");

    editDateValue.addEventListener("change", (e) => {
      let output = e.target.value;
      let newTargetDate = new Date(output);
      let now = new Date();
      let selectedDueDate = newTargetDate - now;


      if (output.trim().length > 0 && selectedDueDate > 0) {
        let editedMonth = newTargetDate.getMonth() + 1;
        let editedDay = newTargetDate.getDate();
        let editedYear = newTargetDate.getFullYear();
      
        const months = [
          "",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const result = `${editedMonth} ${editedDay} ${editedYear}`;
        const part = result.split(" ");
        const choosenDate = `${months[part[0]]} ${part[1]},${part[2]}`;
        document.getElementById("time-due-date").textContent =
          `Due ${choosenDate}`;
    
        let remainingDaysStatus = getStatusMessage(newTargetDate);
        document.getElementById("time-remaining").textContent =
          remainingDaysStatus;
      } else {
        console.log("choose a day later than today");
      }
    });
  }


    function handleSave() {
      let userTitle = document.getElementById("edit-title").value;
      if (userTitle.trim().length > 0) {
        let titleContain = document.getElementById("project-title"); // pass value to main UI
        titleContain.textContent = userTitle; //// pass value to main UI
      }

      handleDescriptionChange();
      handleDate();
      handleSelect();
    }

  handleSave();
};;

initApp();
