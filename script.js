"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const totalTasks = document.getElementById("totalTasks");
const doneTasks = document.getElementById("doneTasks");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const prioritySelect = document.getElementById("prioritySelect");

const taskLists = document.querySelectorAll(".task-list");

const todoCount = document.getElementById("todoCount");
const todoList = document.getElementById("todoList");

const progressCount = document.getElementById("progressCount");
const progressList = document.getElementById("progressList");

const doneCount = document.getElementById("doneCount");
const doneList = document.getElementById("doneList");

// ======================================================
// APP STATE
// ======================================================

let tasks = [];

// ======================================================
// CREATE TASK FUNCTION
// ======================================================

function createTask(text, priority) {
  const task = {
    id: Date.now(),
    text: text,
    priority: priority,
    column: "todo",
  };

  tasks.push(task);

  saveTasks();
  renderTasks();
}

// ======================================================
// RENDER TASKS FUNCTION
// ======================================================

function renderTasks() {
  todoList.innerHTML = "";
  progressList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task) => {
    const card = document.createElement("div");

    card.classList.add("task-card");
    card.draggable = true;
    card.dataset.id = task.id;

    card.innerHTML = `
      <p>${task.text}</p>

        <div class="task-footer">
        <span class="priority ${task.priority}">
          ${task.priority}
        </span>

        <button
          class="delete-btn"
          onclick="deleteTask(${task.id})"
        >
          Delete
        </button>
      </div>
`;

    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    const list = getTaskListByColumn(task.column);

    list.appendChild(card);
  });

  updateCounters();
  renderEmptyStates();
}

// ======================================================
// GET TASK LIST BY COLUMN FUNCTION
// ======================================================

function getTaskListByColumn(column) {
  if (column === "todo") return todoList;
  if (column === "progress") return progressList;
  if (column === "done") return doneList;
}

// ======================================================
// DELETE TASK FUNCTION
// ======================================================

function deleteTask(id) {
  tasks = tasks.filter((task) => {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

// ======================================================
// DRAG START FUNCTION
// ======================================================

function handleDragStart(e) {
  e.currentTarget.classList.add("dragging");

  e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id);
}

// ======================================================
// DRAG END FUNCTION
// ======================================================

function handleDragEnd(e) {
  e.currentTarget.classList.remove("dragging");
}

// ======================================================
// COLUMN DRAG EVENTS
// ======================================================

taskLists.forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();

    list.parentElement.classList.add("drag-over");
  });

  list.addEventListener("dragleave", () => {
    list.parentElement.classList.remove("drag-over");
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();

    list.parentElement.classList.remove("drag-over");

    const taskId = Number(e.dataTransfer.getData("text/plain"));
    const newColumn = list.dataset.column;

    const task = tasks.find((task) => {
      return task.id === taskId;
    });

    task.column = newColumn;

    saveTasks();
    renderTasks();
  });
});

// ======================================================
// UPDATE COUNTERS FUNCTION
// ======================================================

function updateCounters() {
  totalTasks.textContent = tasks.length;

  const todoTasks = tasks.filter((task) => {
    return task.column === "todo";
  });

  const progressTasks = tasks.filter((task) => {
    return task.column === "progress";
  });

  const doneColumnTasks = tasks.filter((task) => {
    return task.column === "done";
  });

  todoCount.textContent = todoTasks.length;

  progressCount.textContent = progressTasks.length;
  doneCount.textContent = doneColumnTasks.length;
  doneTasks.textContent = doneColumnTasks.length;
}

// ======================================================
// RENDER EMPTY STATES FUNCTION
// ======================================================

function renderEmptyStates() {
  taskLists.forEach((list) => {
    if (list.children.length === 0) {
      list.innerHTML = `
      <div class="empty-state">
      No Tasks here yet.
      </div>`;
    }
  });
}

// ======================================================
// SAVE TASKS FUNCTION
// ======================================================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ======================================================
// LOAD TASKS FUNCTION
// ======================================================

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasks = [];
  }

  renderTasks();
}

// ======================================================
// FORM SUBMIT EVENT
// ======================================================

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const trimmedText = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (trimmedText === "") return;

  createTask(trimmedText, priority);

  taskInput.value = "";
  taskInput.focus();
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadTasks();
