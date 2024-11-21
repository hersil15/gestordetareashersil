document.addEventListener('DOMContentLoaded', function() {
  const taskManager = new TaskManager();

  document.getElementById('addTaskButton').addEventListener('click', function() {
      agregarTarea();
  });

  document.getElementById('newTask').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          agregarTarea();
      }
  });

  document.getElementById('taskList').addEventListener('click', function(event) {
      const taskId = event.target.closest('li').getAttribute('data-id');

      if (event.target.classList.contains('delete-button')) {
          taskManager.deleteTask(taskId);
      }

      if (event.target.classList.contains('complete-button')) {
          taskManager.completeTask(taskId);
      }

      if (event.target.classList.contains('edit-button')) {
          taskManager.editTask(taskId);
      }
  });

  function agregarTarea() {
      const taskDescription = document.getElementById('newTask').value.trim();
      if (taskDescription !== "") {
          taskManager.addTask(taskDescription);
          document.getElementById('newTask').value = '';
      }
  }
});

class TaskManager {
  constructor() {
      this.tasks = [];
      this.taskIdCounter = 0;
  }

  addTask(description) {
      const task = {
          id: this.taskIdCounter++,
          description: description,
          completed: false
      };
      this.tasks.push(task);
      this.renderTasks();
  }

  deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id != taskId);
      this.renderTasks();
  }

  completeTask(taskId) {
      const task = this.tasks.find(task => task.id == taskId);
      if (task) {
          task.completed = !task.completed;
          this.renderTasks();
      }
  }

  editTask(taskId) {
      const task = this.tasks.find(task => task.id == taskId);
      if (task) {
          const newDescription = prompt("Edita la descripción de la tarea:", task.description);
          if (newDescription !== null && newDescription.trim() !== "") {
              task.description = newDescription.trim();
              this.renderTasks();
          }
      }
  }

  renderTasks() {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';

      const activeTasks = this.tasks.filter(task => !task.completed);
      const completedTasks = this.tasks.filter(task => task.completed);

      if (activeTasks.length > 0) {
          const activeTasksHeader = document.createElement('h2');
          activeTasksHeader.textContent = 'Tareas Pendientes';
          taskList.appendChild(activeTasksHeader);

          activeTasks.forEach(task => {
              const taskItem = document.createElement('li');
              taskItem.setAttribute('data-id', task.id);
              taskItem.innerHTML = `
                  <input type="text" value="${task.description}" readonly>
                  <div class="task-buttons">
                      <button class="complete-button">Completar</button>
                      <button class="edit-button">Editar</button>
                      <button class="delete-button">Eliminar</button>
                  </div>
              `;
              taskList.appendChild(taskItem);
          });
      }

      if (completedTasks.length > 0) {
          const completedTasksHeader = document.createElement('h2');
          completedTasksHeader.textContent = 'Tareas Completadas';
          taskList.appendChild(completedTasksHeader);

          completedTasks.forEach(task => {
              const taskItem = document.createElement('li');
              taskItem.setAttribute('data-id', task.id);
              taskItem.classList.add('completed');
              taskItem.innerHTML = `
                  <span class="completed-text">${task.description}</span>
                  <div class="task-buttons">
                      <button class="complete-button">Desmarcar</button>
                      <button class="delete-button">Eliminar</button>
                  </div>
              `;
              taskList.appendChild(taskItem);
          });
      }

      if (activeTasks.length === 0 && completedTasks.length > 0) {
          alert('¡Felicidades! Has completado todas las tareas.');
      }
  }
}
