document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("work");
    const addButton = document.getElementById("add");
    const errorText = document.querySelector(".error");
    const workLeft = document.querySelector(".workleft");
    const taskList = document.querySelector(".task");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function updateTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }

    function loadTasks() {
        taskList.innerHTML = "";

        if (tasks.length > 0) {
            tasks.forEach((task, index) => {
                const taskItem = document.createElement("div");
                taskItem.className = "task-item";
                taskItem.dataset.index = index;
                taskItem.innerHTML = `
                    <p class="task-text">${task}</p>
                    <button class="edit-btn">
                        <span class="edit">Edit</span>
                    </button>
                    <button class="completed-btn">
                        <span class="fas fa-check"></span>
                    </button>
                    <button class="delete-btn">
                        <span class="Delete">Delete</span>
                    </button>
                `;
                taskList.appendChild(taskItem);
            });
            errorText.style.display = "none";
        } else {
            errorText.style.display = "block";
        }
        workLeft.textContent = tasks.length;
    }

    addButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push(taskText);
            updateTasks();
            taskInput.value = "";
            errorText.style.display = "none";
        } else {
            errorText.style.display = "block";
        }
    });

    taskList.addEventListener("click", (event) => {
        const target = event.target;
    
        if (target.classList.contains("edit-btn")) {
            const taskItem = target.closest(".task-item");
            const taskTextElement = taskItem.querySelector(".task-text");
            taskTextElement.contentEditable = true;
            taskTextElement.focus();
            taskTextElement.addEventListener("blur", () => {
                taskTextElement.contentEditable = false;
                const index = taskItem.dataset.index;
                tasks[index] = taskTextElement.textContent;
                updateTasks();
                console.log("Edit complete:", taskTextElement.textContent);
            });
        }
        else if (target.classList.contains("completed-btn")) {
            const taskItem = target.closest(".task-item");
            taskItem.classList.toggle("completed");
            if (taskItem.classList.contains("completed")) {
                taskItem.style.background = "linear-gradient(to right, #2ecc71, #27ae60)";
            } else {
                taskItem.style.background = "#222";
            }
        } else if (target.classList.contains("delete-btn")) {
            event.stopPropagation();
            const taskItem = target.closest(".task-item");
            const index = taskItem.dataset.index;

            tasks.splice(index, 1);
            updateTasks();
        }
    });
    loadTasks();
});
