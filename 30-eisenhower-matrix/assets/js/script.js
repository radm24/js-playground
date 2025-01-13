'use strict';

(function () {
  // Elements
  const activeTasksSection = document.querySelector('.active-tasks');
  const completedTasksSection = document.querySelector('.completed-tasks');
  const headerTitleEl = document.querySelector('.header h4');
  const btnSwitchCompletedTasks = document.getElementById('btnCompletedTasks');
  const btnSwitchActiveTasks = document.getElementById('btnActiveTasks');
  const listWrapperElements = [...document.querySelectorAll('.list-wrapper')];
  const btnsAdd = [...document.querySelectorAll('.btn--add')];
  const newTaskInputs = [...document.querySelectorAll('.list-wrapper input')];
  const taskControlsEl = document.querySelector('.task-controls');
  const completeZone = document.querySelector('.complete-zone');
  const deleteZone = document.querySelector('.delete-zone');
  const iconCheckMark = document.getElementById('checkMark');
  const iconTrashBin = document.getElementById('trashBin');

  // State
  let tasks = {
    active: {
      ninu: [],
      niu: [],
      inu: [],
      iu: [],
    },
    completed: {
      ninu: [],
      niu: [],
      inu: [],
      iu: [],
    },
  };
  const currentDragElements = {
    listItem: null,
    initialParentList: null,
    finalParentList: null,
  };

  function toggleTasks() {
    const currentMode = activeTasksSection.classList.contains('hidden')
      ? 'completed'
      : 'active';
    if (currentMode === 'active') {
      activeTasksSection.classList.add('hidden');
      headerTitleEl.textContent = 'Completed Tasks';
      completedTasksSection.classList.remove('hidden');
      btnSwitchCompletedTasks.classList.add('hidden');
      btnSwitchActiveTasks.classList.remove('hidden');
    }
    if (currentMode === 'completed') {
      completedTasksSection.classList.add('hidden');
      headerTitleEl.textContent = '\u200B';
      activeTasksSection.classList.remove('hidden');
      btnSwitchActiveTasks.classList.add('hidden');
      btnSwitchCompletedTasks.classList.remove('hidden');
    }
  }

  function enterCreateMode(e) {
    e.target.closest('.list-wrapper').classList.add('create-mode');
    e.target.previousElementSibling.focus();
  }

  function leaveCreateMode(e) {
    e.target.closest('.list-wrapper').classList.remove('create-mode');
    e.target.value = '';
  }

  function inputKeyupHandler(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      const listEl = e.target.previousElementSibling;
      const task = e.target.value;
      addNewTask(listEl, task);
      leaveCreateMode(e);
    }
    if (e.key === 'Escape') {
      leaveCreateMode(e);
    }
  }

  function createActiveListItem(task) {
    const listItem = document.createElement('li');
    const textNode = document.createTextNode(task);
    listItem.append(textNode);
    listItem.classList.add('list__item');
    listItem.setAttribute('draggable', 'true');
    listItem.addEventListener('dragstart', dragStartHandler);
    listItem.addEventListener('dragend', dragEndHandler);
    return listItem;
  }

  function createCompletedListItem({ task, completionDate }) {
    // List Item
    const listItem = document.createElement('li');
    const listTextNode = document.createTextNode(task);
    listItem.append(listTextNode);
    listItem.classList.add('list__item', 'list__item--completed');
    // Span containing completion date
    const span = document.createElement('span');
    const spanTextNode = document.createTextNode(
      `Completed on ${completionDate}`
    );
    span.append(spanTextNode);
    span.classList.add('completion-date');
    listItem.append(span);
    return listItem;
  }

  function addNewTask(listEl, task) {
    // Save new task to local storage
    tasks.active[listEl.id.replace('active-', '')].push(task);
    saveTasksStorage();
    // Render new task
    const listItem = createActiveListItem(task);
    listEl.append(listItem);
    listItem.scrollIntoView({ behavior: 'smooth' });
  }

  function getTasksStorage() {
    const data = JSON.parse(localStorage.getItem('tasks'));
    if (!data) return;
    tasks = data;
    renderTasks();
  }

  function saveTasksStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    for (const [type, typeTasks] of Object.entries(tasks)) {
      for (const [id, categoryTasks] of Object.entries(typeTasks)) {
        const listEl = document.getElementById(`${type}-${id}`);
        listEl.replaceChildren();
        categoryTasks.forEach((task) => {
          const listItem =
            type === 'active'
              ? createActiveListItem(task)
              : createCompletedListItem(task);
          listEl.append(listItem);
        });
      }
    }
  }

  function dragStartHandler(e) {
    currentDragElements.listItem = e.target;
    currentDragElements.initialParentList = e.target.parentElement;
    document.body.classList.add('dragging-mode');
    // Create clone of the list item
    const cloneItem = e.target.cloneNode(true);
    cloneItem.classList.add('list__item-clone');
    document.body.appendChild(cloneItem);
    // Set clone as ghost image
    e.dataTransfer.setDragImage(
      cloneItem,
      cloneItem.offsetWidth / 2,
      cloneItem.offsetHeight / 2
    );
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging-active');
    // Show delete zone
    taskControlsEl.classList.remove('hidden');
  }

  function dragEndHandler(e) {
    document.body.classList.remove('dragging-mode');
    document.querySelector('.list__item-clone').remove();
    // Stop drag operation and remove animation effect from icons
    e.target.classList.remove('dragging-active');
    iconCheckMark.classList.remove('shake-animation');
    iconTrashBin.classList.remove('shake-animation');
    // Hide delete zone
    taskControlsEl.classList.add('hidden');
    // Update tasks if needed and reset the drag action state
    if (currentDragElements.finalParentList) updateTaskLists();
    currentDragElements.listItem = null;
    currentDragElements.initialParentList = null;
    currentDragElements.finalParentList = null;
  }

  function dragOverHandler(e) {
    e.preventDefault();
    // Only inserting if a list is empty or target is a list item
    const dropTarget = e.target;
    const { listItem } = currentDragElements;
    // Target is list wrapper
    if (
      dropTarget.classList.contains('list-wrapper') &&
      dropTarget.querySelector('.list').children.length === 0
    ) {
      const listEl = dropTarget.querySelector('.list');
      currentDragElements.finalParentList = listEl;
      listEl.append(listItem);
    }
    // Target is a list item
    if (
      dropTarget.classList.contains('list__item') &&
      dropTarget !== currentDragElements.listItem
    ) {
      currentDragElements.finalParentList = dropTarget.closest('.list');
      // Find the position where to insert the list item
      const { y } = dropTarget.getBoundingClientRect();
      const insertPosition =
        e.clientY - y > dropTarget.offsetHeight / 2 ? 'after' : 'before';
      const listEl = dropTarget.parentElement;
      // Inserting
      if (insertPosition === 'before') {
        listEl.insertBefore(listItem, dropTarget);
      }
      if (insertPosition === 'after') {
        if (listEl.lastChild === dropTarget) {
          listEl.append(listItem);
        } else {
          listEl.insertBefore(listItem, dropTarget.nextSibling);
        }
      }
    }
  }

  function updateTaskLists() {
    const { initialParentList, finalParentList } = currentDragElements;
    [initialParentList, finalParentList].forEach((list, idx) => {
      if (idx === 1 && initialParentList === finalParentList) return;
      tasks.active[list.id.replace('active-', '')] = [...list.children].map(
        (el) => el.textContent
      );
    });
    saveTasksStorage();
  }

  function completeTask() {
    const id = currentDragElements.initialParentList.id.replace('active-', '');
    const task = currentDragElements.listItem.textContent;
    const completionDate = new Date().toISOString().split('T')[0];
    // Add the task to completed ones
    tasks.completed[id].unshift({
      task,
      completionDate,
    });
    // Remove the task from active ones
    deleteTask();
    renderTasks();
  }

  function deleteTask() {
    currentDragElements.listItem.remove();
    currentDragElements.finalParentList = currentDragElements.initialParentList;
    updateTaskLists();
  }

  // Event listeners
  [btnSwitchActiveTasks, btnSwitchCompletedTasks].forEach((btn) =>
    btn.addEventListener('click', toggleTasks)
  );
  listWrapperElements.forEach((listWrapper) => {
    listWrapper.addEventListener('dragover', dragOverHandler);
  });
  btnsAdd.forEach((btn) => btn.addEventListener('click', enterCreateMode));
  newTaskInputs.forEach((input) => {
    input.addEventListener('blur', leaveCreateMode);
    input.addEventListener('keyup', inputKeyupHandler);
  });
  [completeZone, deleteZone].forEach((el) =>
    el.addEventListener('dragenter', (e) => {
      el.firstElementChild.classList.add('shake-animation');
    })
  );
  [completeZone, deleteZone].forEach((el) =>
    el.addEventListener('dragleave', (e) => {
      console.log('dragleave');
      if (e.target === el.firstElementChild) return;
      el.firstElementChild.classList.remove('shake-animation');
    })
  );
  [completeZone, deleteZone].forEach((el) =>
    el.addEventListener('dragover', (e) => e.preventDefault())
  );
  completeZone.addEventListener('drop', completeTask);
  deleteZone.addEventListener('drop', deleteTask);

  getTasksStorage();
})();
