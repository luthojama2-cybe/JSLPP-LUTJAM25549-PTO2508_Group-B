import { initialTasks } from "./initialData.js";

const STORAGE_KEY = "kanban_tasks";

let tasks = [];
let editingTaskId = null;

/* ---------- LOCAL STORAGE ---------- */

// Save tasks to localStorage
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
  const storedTasks = localStorage.getItem(STORAGE_KEY);

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  } else {
    tasks = [...initialTasks];
    saveTasksToStorage(); // save initial data on first load
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
  document.querySelectorAll(".tasks-container").forEach((c) => (c.innerHTML = ""));

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
function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;

  if (editingTaskId) {
    // EDIT
    const task = tasks.find((t) => t.id === editingTaskId);
    task.title = title;
    task.description = desc;
    task.status = status;
  } else {
    // CREATE
    const newTask = {
      id: Date.now(),
      title,
      description: desc,
      status,
      board: "Launch Career",
    };

    tasks.push(newTask);
  }

  saveTasksToStorage(); // SAVE HERE

  document.getElementById("task-modal").close();
  renderTasks();
}

/* ---------- INIT ---------- */
function init() {
  loadTasksFromStorage(); // LOAD FIRST
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