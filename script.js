let tasks = [{
  id: Date.now(),
  title: 'aman',
  priority: 'high',
  status: 'todo',
}]

tasks = JSON.parse(localStorage.getItem('tasks')) || [];
function onLoad() {
  if(!tasks || !tasks.length) return alert('There is no tasks.');
  renderBoard();
}

onLoad();

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if(!title) return alert('Task title cannot be empty.');
  createTask(title);
  taskForm.reset();
});

function createTask(title) {
  const newTask = {
    id: Date.now(),
    title: title,
    priority: 'medium',
    status: 'todo',
  };
  tasks.unshift(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderBoard();
}

function renderColumns(status, columnSelector) {
  const container = document.querySelector(columnSelector);
  const filteredTasks = tasks.filter(task => task.status === status);
  if(!filteredTasks || !filteredTasks.length) return container.innerHTML = `<p class="no-task"> There is no ${status} tasks.`;

  container.innerHTML = filteredTasks.map((task) => 
    `
      <div class="kanban-card" data-id="${task.id}">
        <h3>${task.title}</h3>
        <p>Priority: ${task.priority}</p>
        <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        <button class="move-btn" onclick="moveTask(${task.id}, '${status}')">>></button>
      </div>
    `
  ).join('');
}

function renderBoard() {
  renderColumns('todo', '#todo-cards');
  renderColumns('in-progress', '#in-progress-cards');
  renderColumns('completed', '#completed-cards');
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id != id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderBoard();
}

function moveTask(id) {
  const task = tasks.find((task) => task.id === id);
  if(task.status === 'todo') task.status = 'in-progress';
  else if(task.status === 'in-progress') task.status = 'completed';
  else console.log("this is last column");
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderBoard();
}