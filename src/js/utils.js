import { todoList, nodeFooter, nodeMain, nodeTodoCount, completeButton, nodeFilters } from "./nodes";

// const test = [
//   { id: "1", title: "titulo1", completed: true },
//   { id: "2", title: "titulo2", completed: true },
//   { id: "3", title: "titulo3", completed: false },
// ];

// localStorage.setItem('mydayapp-js', JSON.stringify(test));



export function loadState(display = false) {
  const initialState = JSON.parse(localStorage.getItem("mydayapp-js")) || [];

  if (initialState.length <= 0) {
    nodeFooter.classList.add('hidden');
    nodeMain.classList.add('hidden');
  } else if (display) {
    nodeFooter.classList.remove('hidden');
    nodeMain.classList.remove('hidden');
  }

}

const createId = (string) => {
  let code = 0;
  for (let i = 0; i < string.length; i++) {
    code += string.charCodeAt(i);
  }

  return code.toString();
}

export const addTodoItems = (event) => {

  const inputTask = event.target.value.trim();

  if (inputTask.length >= 1) {

    const idItem = createId(inputTask);

    const createItem = {
      id: idItem,
      title: inputTask,
      completed: false,
    }

      ;
    event.target.value = "";
    const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")) || [];
    getLocalStorage.push(createItem);
    localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));
    loadState(true);
    // location.hash = "";
    refreshList();
  }
}

export const removeTodoItem = (event) => {

  if (event.target.nodeName === 'BUTTON') {
    const taskId = event.target.dataset.id;
    const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")).filter(item => item.id != taskId);
    localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));

    loadState(false);
    refreshList();
  }

};


export const toogleCompletedItem = (event) => {

  const isInputCheck = event.target.classList.contains('toggle');

  if (event.target.nodeName === 'INPUT' && isInputCheck) {
    const taskId = event.target.nextSibling.nextSibling.dataset.id;

    const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")).map((item) => {
      if (item.id == taskId) {
        item.completed = !item.completed;
      }
      return item;
    });

    localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));

    refreshList();

  }

}

const updateTask = (nodeList, nodeFooter, taskId) => {
  return function () {
    if (event.keyCode === 13) {
      const newInput = (event.target.value).trim();
      const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")).map((item) => {
        if (item.id == taskId && newInput.length > 0) {
          item.title = newInput;
        }
        return item;
      });

      localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));
      nodeList.classList.remove('editing');
      nodeFooter.classList.remove('hidden');
      refreshList();

    }
    if (event.keyCode === 27) {
      nodeList.classList.remove('editing');
      nodeFooter.classList.remove('hidden');
    }
  }
};

export const editingItem = (event) => {

  const nodeList = event.target.parentNode.parentNode;
  const isNotNodeCompleted = !nodeList.classList.contains('completed');

  if (event.target.nodeName === "LABEL" && isNotNodeCompleted) {
    nodeList.classList.add('editing');
    nodeFooter.classList.add('hidden');
    const nodeInput = nodeList.lastElementChild;
    nodeInput.focus();
    const taskId = event.target.nextSibling.dataset.id;
    nodeInput.addEventListener('keydown', updateTask(nodeList, nodeFooter, taskId));
  }
}

const TodoCount = (count = 0) => {
  if (count == 1) {
    nodeTodoCount.innerHTML = `<strong>${count}</strong> item left`
  } else {
    nodeTodoCount.innerHTML = `<strong>${count}</strong> items left`
  }
}


const clearCompletedBtn = () => {

  const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")).filter((item) => !item.completed);
  localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));
  refreshList();

}


export const selectFilter = () => {

  if (location.hash == '#/') {
    refreshList();
  } else if (location.hash == '#/pending') {
    const pendingFilterStorage = JSON.parse(localStorage.getItem("mydayapp-js")).filter(item => !item.completed) || [];
    refreshList(pendingFilterStorage);

  } else if (location.hash == '#/completed') {
    const completeFilterStorage = JSON.parse(localStorage.getItem("mydayapp-js")).filter(item => item.completed) || [];
    refreshList(completeFilterStorage);

  } else {
    refreshList();
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

export const refreshList = (Storage = []) => {

  todoList.innerHTML = '';
  // let getLocalStorage;

  // if (Storage.length > 1) {
  //   getLocalStorage = [...Storage];
  // } else {
  //   getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js"));
  // }
  const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")) || [];

  const listTask = getLocalStorage.map(item => {
    const nodeLi = document.createElement('li');
    const nodeDiv = document.createElement('DIV');
    nodeDiv.classList.add('view');
    const nodeInput = document.createElement('input');
    nodeInput.classList.add('toggle');
    nodeInput.setAttribute('type', "checkbox");
    const nodeLabel = document.createElement('label');
    nodeLabel.innerText = item.title;
    const nodeButton = document.createElement('button');
    nodeButton.dataset.id = item.id;
    nodeButton.classList.add('destroy');
    nodeDiv.append(nodeInput, nodeLabel, nodeButton);
    const nodeInputEdit = document.createElement('input');
    nodeInputEdit.classList.add('edit');
    nodeInputEdit.setAttribute('value', item.title);
    nodeLi.append(nodeDiv, nodeInputEdit);

    if (item.completed) {
      nodeLi.classList.add('completed');
      nodeInput.setAttribute('checked', "true");
    }
    if (item.editing) {
      nodeLi.classList.add('editing');
    }

    return nodeLi;
  });

  todoList.append(...listTask);
  todoList.addEventListener('dblclick', editingItem);
  todoList.addEventListener('click', removeTodoItem);
  todoList.addEventListener('click', toogleCompletedItem);
  completeButton.addEventListener('click', clearCompletedBtn);

  const pendingFilter = listTask.filter(item => !item.classList.contains('completed'));
  const valuePending = pendingFilter.length;

  const anyComplete = listTask.find(item => item.classList.contains('completed'));
  anyComplete ? completeButton.classList.remove('hidden') : completeButton.classList.add('hidden');

  TodoCount(valuePending);
}