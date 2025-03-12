document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('clearTasksBtn').addEventListener('click', clearTasks);
document.getElementById('filterTasks').addEventListener('change', filterTasks);
document.getElementById('sortTasksBtn').addEventListener('click', sortTasks);
document.getElementById('themeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
    updateTaskCount();
    checkDueDates();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskCategory = document.getElementById('taskCategory').value;
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const task = { text: taskText, priority: taskPriority, dueDate: taskDueDate, category: taskCategory, completed: false };
        addTaskToDOM(task);
        saveTaskToLocalStorage(task);
        taskInput.value = '';
        document.getElementById('taskDueDate').value = '';
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.textContent = `${task.text} (Priority: ${task.priority}, Due: ${task.dueDate}, Category: ${task.category})`;
    li.classList.toggle('completed', task.completed);
    li.addEventListener('click', toggleTaskCompletion);
    li.addEventListener('dblclick', () => editTask(li));
    taskList.appendChild(li);
    updateTaskCount();
}

function toggleTaskCompletion() {
    this.classList.toggle('completed');
    updateLocalStorage();
}

function editTask(taskElement) {
    const newTaskText = prompt('Edit your task:', taskElement.textContent);
    if (newTaskText) {
        taskElement.textContent = newTaskText;
        updateLocalStorage();
    }
}

function clearTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        document.getElementById('taskList').innerHTML = '';
        localStorage.removeItem('tasks');
        updateTaskCount();
    }
}

function filterTasks() {
    const filterValue = this.value;
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        if (filterValue === 'all') {
            task.style.display = 'flex';
        } else if (filterValue === 'completed' && !task.classList.contains('completed')) {
            task.style.display = 'none';
        } else if (filterValue === 'pending' && task.classList.contains('completed')) {
            task.style.display = 'none';
        } else {
            task.style.display = 'flex';
        }
    });
}

function sortTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
        const aDueDate = a.textContent.match(/Due: (\d{4}-\d{2}-\d{2})/)[1];
        const bDueDate = b.textContent.match(/Due: (\d{4}-\d{2}-\d{2})/)[1];
        return new Date(aDueDate) - new Date(bDueDate);
    });
    tasks.forEach(task => taskList.appendChild(task));
}

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(task => {
        tasks.push({
            text: task.textContent.split(' (Priority:')[0],
            priority: task.textContent.split('Priority: ')[1].split(',')[0],
            dueDate: task.textContent.split('Due: ')[1].split(',')[0],
            category: task.textContent.split('Category: ')[1].split(')')[0],
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCount() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    document.getElementById('taskCount').textContent = `Total Tasks: ${totalTasks}, Completed: ${completedTasks}`;
}

function checkDueDates() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate - now;
        if (timeDiff <= 86400000 && timeDiff >= 0) { // 24 hours in milliseconds
            alert(`Task "${task.text}" is due soon!`);
        }
    });
}
