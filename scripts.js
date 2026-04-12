const API_URL = "https://jsl-kanban-api.vercel.app/";
const STORAGE_KEY = "kanban_tasks";

let tasks = [];
let editingTaskId = null;


/* LOCAL STORAGE */

/*
Saves the current tasks array to localStorage
 */
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* 
 Loads tasks from localStorage and assigns them to the tasks array
 */
function loadTasksFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return;

  try {
    tasks = JSON.parse(stored);
  } catch {
    tasks = [];
  }
}


/*  API CALLS */

/**
 * Fetches tasks from the API and renders them
 * Shows loading and error states
 * @async
 * @returns {Promise<void>}
 */
async function fetchTasks() {

  const loading = document.getElementById("loading-message");
  const error = document.getElementById("error-message");

  try {

    loading.style.display = "block";
    error.style.display = "none";

    const res = await fetch(API_URL);

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data = await res.json();

    // Merge API tasks with locally stored tasks
    const apiTasks = data;

    const localTasks = tasks;

    const mergedTasks = [...apiTasks];

    localTasks.forEach(localTask => {
      const exists = mergedTasks.some(t => t.id === localTask.id);
      if (!exists) {
        mergedTasks.push(localTask);
      }
    });

    tasks = mergedTasks;

    saveTasksToStorage();
    renderTasks();

  } catch (err) {

    console.error("Fetch error:", err);

    error.textContent = "⚠️ Failed to load tasks. Showing cached data.";
    error.style.display = "block";

    renderTasks(); // show cached tasks

  } finally {
    loading.style.display = "none";
  }
}


/**
 * Sends a new task to the API
 * @async
 * @param {Object} task
 * @param {string} task.title
 * @param {string} task.description
 * @param {"todo"|"doing"|"done"} task.status
 * @returns {Promise<void>}
 */
async function createTask(task) {

  try {

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });

  } catch (err) {

    console.error("Create error:", err);

  }
}


/**
 * Updates an existing task in the API
 * @async
 * @param {number|string} id
 * @param {Object} updatedTask
 * @returns {Promise<void>}
 */
async function updateTask(id, updatedTask) {

  try {

    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask)
    });

  } catch (err) {

    console.error("Update error:", err);

  }
}


/**
 * Deletes a task from the API
 * @async
 * @param {number|string} id
 * @returns {Promise<void>}
 */
async function deleteTask(id) {

  try {

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

  } catch (err) {

    console.error("Delete error:", err);

  }
}


/* RENDER TASKS */

/**
 * Returns the DOM container for a specific task column
 * @param {"todo"|"doing"|"done"} status
 * @returns {HTMLElement|null}
 */
function getTaskContainerByStatus(status) {

  return document.querySelector(
    `.column-div[data-status="${status}"] .tasks-container`
  );

}


/**
 * Creates a DOM element for a task card
 * @param {Object} task
 * @param {string} task.title
 * @returns {HTMLElement}
 */
function createTaskElement(task) {

  const el = document.createElement("div");

  el.className = "task-div";
  el.textContent = task.title;

  el.addEventListener("click", () => openTaskModal(task));

  return el;
}


/**
 * Renders all tasks into their correct columns
 */
function renderTasks() {

  document
    .querySelectorAll(".tasks-container")
    .forEach(container => (container.innerHTML = ""));

  tasks.forEach(task => {

    const container = getTaskContainerByStatus(task.status);

    if (container) {
      container.appendChild(createTaskElement(task));
    }

  });

}


/* MODAL LOGIC */

/**
 * Opens the task modal for creating or editing a task
 * @param {Object|null} task
 */
function openTaskModal(task = null) {

  const modal = document.getElementById("task-modal");

  const title = document.getElementById("task-title");
  const desc = document.getElementById("task-desc");
  const status = document.getElementById("task-status");
  const modalTitle = document.getElementById("modal-title");

  if (task) {

    editingTaskId = task.id;

    modalTitle.textContent = "Edit Task";

    title.value = task.title;
    desc.value = task.description;
    status.value = task.status;

  } else {

    editingTaskId = null;

    modalTitle.textContent = "Add Task";

    title.value = "";
    desc.value = "";
    status.value = "todo";

  }

  modal.showModal();
}


/**
 * Handles deleting the currently edited task
 */
function handleDeleteTask() {

  if (!editingTaskId) return;

  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  tasks = tasks.filter(t => t.id !== editingTaskId);

  renderTasks();
  saveTasksToStorage();

  deleteTask(editingTaskId);

  document.getElementById("task-modal").close();

  editingTaskId = null;

}


/* FORM HANDLING */

/**
 * Handles task form submission
 * Creates or updates tasks
 * @async
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 */
async function handleFormSubmit(e) {

  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;

  if (editingTaskId) {

    const task = tasks.find(t => t.id === editingTaskId);

    if (task) {

      task.title = title;
      task.description = desc;
      task.status = status;

    }

    renderTasks();
    saveTasksToStorage();

    await updateTask(editingTaskId, {
      title,
      description: desc,
      status
    });

  } else {

    const newTask = {
      id: Date.now(),
      title,
      description: desc,
      status,
      board: "Launch Career"
    };

    tasks.push(newTask);

    renderTasks();
    saveTasksToStorage();

    await createTask(newTask);

  }

  document.getElementById("task-modal").close();

}


/* SIDEBAR */

/**
 * Hides the sidebar and expands the layout
 */
function toggleSidebar() {

  const sidebar = document.querySelector(".side-bar");
  const layout = document.getElementById("layout");
  const showBtn = document.getElementById("show-sidebar-btn");

  sidebar.classList.add("hidden");
  layout.classList.add("full-width");

  showBtn.style.display = "block";

  localStorage.setItem("sidebar_hidden", true);

}


/**
 * Shows the sidebar again
 */
function showSidebar() {

  const sidebar = document.querySelector(".side-bar");
  const layout = document.getElementById("layout");
  const showBtn = document.getElementById("show-sidebar-btn");

  sidebar.classList.remove("hidden");
  layout.classList.remove("full-width");

  showBtn.style.display = "none";

  localStorage.setItem("sidebar_hidden", false);

}


/* THEME TOGGLE */

/**
 * Initializes the theme toggle and syncs with localStorage
 */
function setupThemeToggle() {

  const toggle = document.getElementById("theme-toggle");
  const mobileToggle = document.getElementById("mobile-theme-toggle");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");
    toggle.checked = true;

  }

  toggle.addEventListener("change", () => {

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );

  });

  if (mobileToggle) {

    mobileToggle.checked = toggle.checked;

    mobileToggle.addEventListener("change", () => {

      toggle.checked = mobileToggle.checked;
      toggle.dispatchEvent(new Event("change"));

    });

    toggle.addEventListener("change", () => {

      mobileToggle.checked = toggle.checked;

    });

  }

}


/* INIT */

/**
 * Initializes the Kanban application
 * - Loads cached tasks
 * - Fetches tasks from API
 * - Registers all event listeners
 * @async
 * @returns {Promise<void>}
 */
async function init() {

  loadTasksFromStorage();
  renderTasks();

  await fetchTasks();

  document
    .getElementById("add-task-btn")
    .addEventListener("click", () => openTaskModal());

  document
    .getElementById("task-form")
    .addEventListener("submit", handleFormSubmit);

  document
    .getElementById("close-modal-btn")
    .addEventListener("click", () =>
      document.getElementById("task-modal").close()
    );

  document
    .getElementById("delete-task-btn")
    .addEventListener("click", handleDeleteTask);

  document
    .getElementById("toggle-sidebar-btn")
    .addEventListener("click", toggleSidebar);

  document
    .getElementById("show-sidebar-btn")
    .addEventListener("click", showSidebar);

  document
    .getElementById("mobile-menu-btn")
    .addEventListener("click", () =>
      document.getElementById("mobile-menu-modal").showModal()
    );

  document
    .getElementById("close-mobile-menu")
    .addEventListener("click", () =>
      document.getElementById("mobile-menu-modal").close()
    );

  setupThemeToggle();

}

document.addEventListener("DOMContentLoaded", init);