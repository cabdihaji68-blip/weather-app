document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const totalTasksElem = document.getElementById("total-tasks");
const pendingTasksElem = document.getElementById("pending-tasks");
const searchInput = document.getElementById("search-input");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

searchInput.addEventListener("input", filterAndSearchTasks);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        filterAndSearchTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert("Fadlan geli hawl!");

    const task = { id: Date.now(), text, completed: false };
    saveTask(task);
    renderTasks();
    taskInput.value = "";
}

function getTasks() {
    return JSON.parse(localStorage.getItem("pro_tasks")) || [];
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("pro_tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = getTasks();
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${task.id})"><i class="fa-solid fa-check"></i></button>
                <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats(tasks);
}

function toggleTask(id) {
    let tasks = getTasks();
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem("pro_tasks", JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("pro_tasks", JSON.stringify(tasks));
    renderTasks();
}

function filterAndSearchTasks() {
    const query = searchInput.value.toLowerCase();
    const tasks = getTasks();
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {
        const matchesFilter = 
            currentFilter === "active" ? !task.completed :
            currentFilter === "completed" ? task.completed : true;
        
        const matchesSearch = task.text.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${task.id})"><i class="fa-solid fa-check"></i></button>
                <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function updateStats(tasks) {
    totalTasksElem.textContent = tasks.length;
    pendingTasksElem.textContent = tasks.filter(t => !t.completed).length;
}

function loadTasks() {
    renderTasks();
}