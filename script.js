
// Get the HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
const remainingCounter = document.getElementById("remainingCounter");

// Store the tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

displayTasks();

// Function to add a new task
function addTask() {

    // Get the task text and remove extra spaces
    const taskText = taskInput.value.trim();

     // Prevent empty tasks
    if (taskText === "") {
        errorMessage.textContent = "Please enter a task!";
        return;
    } else {
        errorMessage.textContent = "";
    }

    // Create a task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add the task to the array
    tasks.push(task);
    saveTasks();

    // Clear the input field
    taskInput.value = "";

    // Display the tasks
    displayTasks();
}

// Add a task when the button is clicked
addTaskBtn.addEventListener("click", addTask);

//Tasks filtering
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get the selected filter
        currentFilter = button.dataset.filter;

        // Display tasks using the selected filter
        displayTasks();
    });
});

// Function to display the tasks
function displayTasks() {

    // Clear the existing task list
    taskList.innerHTML = "";

    // Show the message when there are no tasks
    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Display each task
    tasks.forEach(function(task) {

        // Create a list item
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.style.alignItems = "center";
        // Create a container for the task
        const taskContainer = document.createElement("div");
        taskContainer.className = "d-flex align-items-center flex-grow-1";
        // Create a checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input me-2";
        checkbox.checked = task.completed;

        // Mark the task as completed or active
        if (task.completed) {
            li.classList.add("completed-task");
        }

        // Filter tasks
        const shouldDisplay =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        li.style.display = shouldDisplay ? "flex" : "none";

        // Update task status when checkbox changes
        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();
            
        });

        // Create task text
        const span = document.createElement("span");
        span.textContent = task.text;

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-outline-danger";
        deleteBtn.textContent = "Delete";

        // Delete the selected task
        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });
            saveTasks();

            displayTasks();
        });

        // Add elements to the page
        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(span);

        li.appendChild(taskContainer);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    // Update the number of incomplete tasks
    const remaining = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    remainingCounter.textContent = remaining + " remaining";
}

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function() {

    // Keep only tasks that are not completed
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    // Save the updated tasks
    saveTasks();

    // Update the task list and remaining counter
    displayTasks();
});

// Display saved tasks when the page loads
displayTasks();

