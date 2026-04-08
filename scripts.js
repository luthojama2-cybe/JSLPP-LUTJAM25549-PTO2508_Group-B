const API_URL = "https://jsl-kanban-api.vercel.app/";
const STORAGE_KEY = "kanban_tasks";

let tasks = [];
let editingTaskId = null;

/* ---------- LOCAL STORAGE ---------- */

// Save tasks
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks
function loadTasksFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch {
      tasks = [];
    }
  }
}

/* ---------- FETCH TASKS FROM API ---------- */
async function fetchTasks() {
  const loading = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");

  try {
    if (loading) loading.style.display = "block";
    if (errorMessage) errorMessage.style.display = "none";

    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    const data = await res.json();

    tasks = data;

    // ✅ Save fresh data to localStorage
    saveTasksToStorage();

    renderTasks();

  } catch (err) {
    console.error("Error fetching tasks:", err);

    if (errorMessage) {
      errorMessage.textContent =
        "⚠️ Failed to load tasks. Showing cached data.";
      errorMessage.style.display = "block";
    }

  } finally {
    if (loading) loading.style.display = "none";
  }
}

/* ---------- CREATE TASK ---------- */
async function createTask(task) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });

    if (!res.ok) {
      throw new Error(`Create failed: ${res.status}`);
    }

  } catch (err) {
    console.error("Error creating task:", err);
  }
}

/* ---------- UPDATE TASK ---------- */
async function updateTask(id, updatedTask) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    });

    if (!res.ok) {
      throw new Error(`Update failed: ${res.status}`);
    }

  } catch (err) {
    console.error("Error updating task:", err);
  }
}

/* ---------- CREATE TASK ELEMENT ---------- */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;

  taskDiv.addEventListener("click", () => openTaskModal(task));

  return taskDiv;
}

/* ---------- GET CONTAINER ---------- */
function getTaskContainerByStatus(status) {
  return document.querySelector(
    `.column-div[data-status="${status}"] .tasks-container`
  );
}

/* ---------- RENDER ---------- */
function renderTasks() {
  document
    .querySelectorAll(".tasks-container")
    .forEach((c) => (c.innerHTML = ""));

  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);

    if (container) {
      container.appendChild(createTaskElement(task));
    }
  });
}

/* ---------- OPEN MODAL ---------- */
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

/*------------Delete / Button --------------*/

async function deleteTask(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status}`);
    }
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

//Delete Handler

function handleDeleteTask() {
  if (!editingTaskId) return;

  const confirmDelete = confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  // remove from array
  tasks = tasks.filter((task) => task.id !== editingTaskId);

  // update UI
  renderTasks();

  // update local storage
  saveTasksToStorage();

  // delete from API
  deleteTask(editingTaskId);

  // close modal
  document.getElementById("task-modal").close();

  editingTaskId = null;
}

/* ---------- SAVE / UPDATE TASK ---------- */
async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;

  if (editingTaskId) {
    // ✅ UPDATE LOCALLY FIRST (instant UI)
    const task = tasks.find((t) => t.id === editingTaskId);

    if (task) {
      task.title = title;
      task.description = desc;
      task.status = status;
    }

    renderTasks();
    saveTasksToStorage();

    // ✅ THEN update API
    await updateTask(editingTaskId, {
      title,
      description: desc,
      status,
    });

  } else {
    const newTask = {
      id: Date.now(), // local ID
      title,
      description: desc,
      status,
      board: "Launch Career",
    };

    // ✅ Add locally first
    tasks.push(newTask);
    renderTasks();
    saveTasksToStorage();

    // ✅ Then send to API
    await createTask(newTask);
  }

  document.getElementById("task-modal").close();
}

/* ---------- INIT ---------- */
async function init() {

  // ✅ Load cached tasks first (instant UI)
  loadTasksFromStorage();
  renderTasks();

  // ✅ Then fetch fresh data
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
}

document.addEventListener("DOMContentLoaded", init);