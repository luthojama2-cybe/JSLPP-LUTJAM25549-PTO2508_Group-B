const API_URL = "https://jsl-kanban-api.vercel.app/";

let tasks = [];
let editingTaskId = null;

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

  } catch (err) {
    console.error("Error fetching tasks:", err);

    if (errorMessage) {
      errorMessage.textContent =
        "⚠️ Failed to load tasks. Please refresh or try again later.";
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
    .forEach((container) => (container.innerHTML = ""));

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

/* ---------- SAVE / UPDATE TASK ---------- */
async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;

  if (editingTaskId) {
    await updateTask(editingTaskId, {
      title,
      description: desc,
      status
    });
  } else {
    const newTask = {
      title,
      description: desc,
      status,
      board: "Launch Career"
    };

    await createTask(newTask);
  }

  await fetchTasks();
  renderTasks();

  document.getElementById("task-modal").close();
}

/* ---------- INIT ---------- */
async function init() {
  await fetchTasks();
  renderTasks();

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
}

document.addEventListener("DOMContentLoaded", init);