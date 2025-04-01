// Get DOM elements
const taskInput = document.getElementById('task-input');
const taskNotes = document.getElementById('task-notes');
const dueDate = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

// Add task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const notesText = taskNotes.value.trim();
  const due = dueDate.value;
  const priority = prioritySelect.value;

  if (taskText !== '') {
    const li = document.createElement('li');
    li.classList.add(priority); // Assign priority class
    li.draggable = true; // Enable drag-and-drop

    li.innerHTML = `
      <div>
        <span class="task-text">${taskText}</span> 
        <span class="task-notes">(${notesText})</span>
        <br />
        <span class="task-due-date">Due: ${due}</span>
      </div>
      <button class="delete-btn">Delete</button>
      <button class="update-btn">Update</button>
    `;

    // Mark task as completed
    li.addEventListener('click', () => {
      li.classList.toggle('completed');
    });

    // Delete task
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering task completion
      li.remove();
    });

    // Update task
    const updateBtn = li.querySelector('.update-btn');
    updateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const updatedText = prompt('Update your task:', li.querySelector('.task-text').innerText);
      if (updatedText !== null && updatedText.trim() !== '') {
        li.querySelector('.task-text').innerText = updatedText.trim();
      }
    });

    // Append new task
    taskList.appendChild(li);
    taskInput.value = ''; // Clear input field
    taskNotes.value = ''; // Clear notes field
    dueDate.value = ''; // Clear due date field
  }
});

// Filter tasks
filterAll.addEventListener('click', () => {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach(task => task.style.display = 'flex');
});

filterActive.addEventListener('click', () => {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach(task => {
    if (task.classList.contains('completed')) {
      task.style.display = 'none';
    } else {
      task.style.display = 'flex';
    }
  });
});

filterCompleted.addEventListener('click', () => {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach(task => {
    if (task.classList.contains('completed')) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  });
});

// Drag-and-drop functionality for task reordering
taskList.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'LI') {
    e.target.classList.add('dragging');
  }
});

taskList.addEventListener('dragend', (e) => {
  if (e.target.tagName === 'LI') {
    e.target.classList.remove('dragging');
  }
});

taskList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskList, e.clientY);
  const dragging = document.querySelector('.dragging');
  if (afterElement == null) {
    taskList.appendChild(dragging);
  } else {
    taskList.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
