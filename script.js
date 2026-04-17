const MS_PER_MINUTE = 1000 * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

// Move targetDate to top scope so all functions can access it
let dateValue = "2026-04-20T12:00:00";
let targetDate = new Date(dateValue);

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

const updateTimeDisplay = (date) => {
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

  const message = getGranularTime(date);
  timeEl.textContent = message;

  if (date < new Date()) {
    timeEl.classList.add("overdue-text");
    overdueInd.classList.remove("hidden");
  } else {
    timeEl.classList.remove("overdue-text");
    overdueInd.classList.add("hidden");
  }
};

const elements = {
  editBtn: document.getElementById("edit-btn"),
  articleEle: document.getElementById("article-el"),
  formEl: document.getElementById("form"),
  cancelEl: document.getElementById("edit-cancelBtn"),
  editSaveBtn: document.getElementById("edit-saveBtn"),
  projectTitle: document.getElementById("project-title"),
  checkbox: document.getElementById("complete-checkbox"),
  expandBtn: document.getElementById("expand-toggle"),
  collapseBox: document.getElementById("collapsible-section"),
};

const initApp = () => {
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

  // Timer interval
  setInterval(() => updateTimeDisplay(targetDate), 60000);

  // Initial render
  updateTimeDisplay(targetDate);

  // Edit Button Logic (Using classList for responsiveness)
  elements.editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    elements.articleEle.classList.add("hidden");
    elements.formEl.classList.remove("hidden");
  });

  // Cancel Button Logic
  elements.cancelEl.addEventListener("click", (e) => {
    e.preventDefault();
    elements.formEl.classList.add("hidden");
    elements.articleEle.classList.remove("hidden");
  });

  // Save Button Logic
  elements.editSaveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSave();
    elements.formEl.classList.add("hidden");
    elements.articleEle.classList.remove("hidden");
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
      targetDate = new Date(editDateInput);
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = targetDate.toLocaleDateString("en-US", options);

      const dueDateEl = document.getElementById("time-due-date");
      dueDateEl.textContent = `Due ${formattedDate}`;
      dueDateEl.setAttribute("datetime", editDateInput.split("T")[0]);
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
    priorityText.textContent = val;
    statusBg.classList.remove("red", "blue", "black");
    if (val === "High") statusBg.classList.add("red");
    else if (val === "Medium") statusBg.classList.add("blue");
    else if (val === "Low") statusBg.classList.add("black");
  });
};

// Global Status Dropdown Listener (outside initApp to avoid duplicate targetDate scoping issues)
const statusDropdown = document.getElementById("setStatus");
const statusTextDisplay = document.getElementById("todo-status");

statusDropdown.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  if (selectedValue.length > 0) {
    statusTextDisplay.textContent = selectedValue;
    const checkbox = document.getElementById("complete-checkbox");
    const title = document.getElementById("project-title");

    if (selectedValue === "Done") {
      checkbox.checked = true;
      title.classList.add("strike-through");
    } else {
      checkbox.checked = false;
      title.classList.remove("strike-through");
    }
    updateTimeDisplay(targetDate);
  }
});

initApp();
