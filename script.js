// App state

let tasks = [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Data logic

function createTask(title) {
  const newTask = {
    id: Date.now(),
    title: title,
    priority: 'medium',
    status: 'todo',
  };
  tasks.unshift(newTask);
  saveTasks();
  renderBoard();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id != id);
  saveTasks();
  renderBoard();
}

function moveTask(id) {
  const task = tasks.find((task) => task.id === id);
  if(!task) return;

  if(task.status === 'todo') task.status = 'in-progress';
  else if(task.status === 'in-progress') task.status = 'completed';
  else if(task.status === 'completed') task.status = 'in-progress';

  saveTasks();
  renderBoard();
}

// UI logic

function renderColumns(status, columnSelector) {
  const container = document.querySelector(columnSelector);
  if(!container) return;

  const filteredTasks = tasks.filter(task => task.status === status);

  if(!filteredTasks || !filteredTasks.length) return container.innerHTML = `<p class="no-task"> There is no ${status} tasks.`;

  container.innerHTML = filteredTasks.map((task) => 
    `
      <div class="kanban-card" data-id="${task.id}">
        <h3>${task.title}</h3>
        <p>Priority: ${task.priority}</p>
        <button class="delete-btn"">X</button>
        <button class="move-btn">${task.status !== 'completed' ? '>>' : '<<'}</button>
      </div>
    `
  ).join('');
}

function renderBoard() {
  renderColumns('todo', '#todo-cards');
  renderColumns('in-progress', '#in-progress-cards');
  renderColumns('completed', '#completed-cards');
}


// Event handlers

function handleFormSubmit(e) {
  e.preventDefault();

  const taskInput = document.getElementById('task-input');
  const title = taskInput.value.trim();

  if(!title) return alert('Task title cannot be empty.');

  createTask(title);
  e.target.reset();
}

function handleBoardClick(e) {
  const isDeleteBtn = e.target.classList.contains('delete-btn');
  const isMoveBtn = e.target.classList.contains('move-btn');
  if(!isDeleteBtn && !isMoveBtn) return;

  const card = e.target.closest('.kanban-card');
  if(!card) return;

  const taskId = Number(card.dataset.id);

  if(isDeleteBtn) {
    deleteTask(taskId);
  } else if(isMoveBtn) {
    moveTask(taskId);
  }
}

// Initializaton

function setUpEventListeners() {
  const taskForm = document.getElementById('task-form');
  const boardContainer = document.querySelector('.board-container');

  if(taskForm) taskForm.addEventListener('submit', handleFormSubmit);
  if(boardContainer) boardContainer.addEventListener('click', handleBoardClick);
}

function initApp() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  renderBoard();

  setUpEventListeners();
}

initApp();
