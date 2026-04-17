const MS_PER_MINUTE = 1000 * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

///////////////    NEW LOGIC FUNCTIONS    ////////////////////////////
const getGranularTime = (dueDate) => {
  const now = new Date();
  const diff = dueDate - now;
  const absDiff = Math.abs(diff);

  if (diff < 0) {
    const hours = Math.floor(absDiff / MS_PER_HOUR);
    if (hours < 1) return `Overdue by less than an hour`;
    return `Overdue by ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (absDiff > MS_PER_DAY) {
    const days = Math.floor(absDiff / MS_PER_DAY);
    return `Due in ${days} ${days === 1 ? "day" : "days"}`;
  } else if (absDiff > MS_PER_HOUR) {
    const hours = Math.floor(absDiff / MS_PER_HOUR);
    return `Due in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else {
    const mins = Math.floor(absDiff / MS_PER_MINUTE);
    return `Due in ${mins} ${mins === 1 ? "minute" : "minutes"}`;
  }
};

const updateTimeDisplay = (targetDate) => {
  const isComplete = document.getElementById("complete-checkbox").checked;
  const timeEl = document.getElementById("time-remaining");
  const overdueInd = document.getElementById("overdue-indicator");
  const statusEl = document.getElementById("todo-status");

  if (isComplete) {
    timeEl.textContent = "Completed";
    timeEl.classList.remove("overdue-text");
    overdueInd.classList.add("hidden");
    statusEl.textContent = "Done";
    return;
  }

  const message = getGranularTime(targetDate);
  timeEl.textContent = message;

  if (targetDate < new Date()) {
    timeEl.classList.add("overdue-text");
    overdueInd.classList.remove("hidden");
  } else {
    timeEl.classList.remove("overdue-text");
    overdueInd.classList.add("hidden");
  }
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
  expandBtn: document.getElementById("expand-toggle"),
  collapseBox: document.getElementById("collapsible-section"),
};

const initApp = () => {
  let dateValue = "2026-04-20T12:00:00";
  let targetDate = new Date(dateValue);

  // Expand/Collapse Listener
  elements.expandBtn.addEventListener("click", () => {
    const isExpanded = elements.collapseBox.classList.toggle("expanded");
    elements.collapseBox.classList.toggle("collapsed");
    elements.expandBtn.textContent = isExpanded ? "Show Less" : "Show More";
    elements.expandBtn.setAttribute("aria-expanded", isExpanded);
  });

  // Checkbox logic
  elements.checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      elements.projectTitle.classList.add("strike-through");
    } else {
      elements.projectTitle.classList.remove("strike-through");
    }
    updateTimeDisplay(targetDate);
  });

  // Timer interval (Updates every 60 seconds)
  setInterval(() => updateTimeDisplay(targetDate), 60000);

  // Initial render
  updateTimeDisplay(targetDate);

  elements.editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    elements.articleEle.style.display = "none";
    elements.formEl.style.display = "block";
  });

  elements.cancelEl.addEventListener("click", (e) => {
    e.preventDefault();
    elements.articleEle.style.display = "block";
    elements.formEl.style.display = "none";
  });

  elements.editSaveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSave();
    elements.articleEle.style.display = "block";
    elements.formEl.style.display = "none";
  });

  function handleSave() {
    let userTitle = document.getElementById("edit-title").value;
    if (userTitle.trim().length > 0) {
      elements.projectTitle.textContent = userTitle;
    }

    let userEditDesc = document.getElementById("edit-description").value;
    if (userEditDesc.trim().length > 0) {
      document.getElementById("description").textContent = userEditDesc;
    }

    let editDateInput = document.getElementById("editDate").value;
    if (editDateInput) {
      // 1. Update the actual targetDate object for the countdown
      targetDate = new Date(editDateInput);

      // 2. Format the date for the "Due April 20, 2026" display
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = targetDate.toLocaleDateString("en-US", options);

      // 3. Update the specific "time-due-date" element
      const dueDateEl = document.getElementById("time-due-date");
      dueDateEl.textContent = `Due ${formattedDate}`;
      dueDateEl.setAttribute("datetime", editDateInput.split("T")[0]);

      // 4. Update the granular countdown timer
      updateTimeDisplay(targetDate);
    }
  }



  // Handle Priority
  const prioritySelect = document.getElementById("edit-priority");
  const statusBg = document.getElementById("statusDynamicBackground");
  const priorityText = document.getElementById("PriorityElement");

  prioritySelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (!val) return;

    // Update the text
    priorityText.textContent = val;

    // Clear old classes before adding the new one
    statusBg.classList.remove("red", "blue", "black");

    // Add the correct class
    if (val === "High") statusBg.classList.add("red");
    else if (val === "Medium") statusBg.classList.add("blue");
    else if (val === "Low") statusBg.classList.add("black");
  });
};;

initApp();
// Locate the dropdown and the status text element
const statusDropdown = document.getElementById("setStatus");
const statusTextDisplay = document.getElementById("todo-status");

statusDropdown.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    
    // Only update if a valid option is picked
    if (selectedValue.length > 0) {
        statusTextDisplay.textContent = selectedValue;
        
        // Logical Sync: If user selects "Done", check the checkbox automatically
        const checkbox = document.getElementById("complete-checkbox");
        if (selectedValue === "Done") {
            checkbox.checked = true;
            // Trigger the existing updateUI or strike-through logic
            document.getElementById("project-title").classList.add("strike-through");
            updateTimeDisplay(targetDate); // From the new time logic
        } else {
            checkbox.checked = false;
            document.getElementById("project-title").classList.remove("strike-through");
            updateTimeDisplay(targetDate);
        }
    }
});