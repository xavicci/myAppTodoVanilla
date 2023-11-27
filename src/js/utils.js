import { todoList, nodeFooter, nodeMain, nodeTypeTodo, newTodo } from "./nodes";

// const test = [
//   [{ id: "1", title: "titulo1", completed: true }],
//   [{ id: "2", title: "titulo2", completed: true }],
//   [{ id: "3", title: "titulo3", completed: false }],
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

    const createItem = [
      {
        id: idItem,
        title: inputTask,
        completed: false,
        editing: false,
      }
    ];
    ;
    event.target.value = "";
    const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")) || [];
    getLocalStorage.push(createItem);
    localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));
    loadState(true);
    refreshList();
  }
}

export const removeTodoItem = (event) => {

  if (event.target.nodeName === 'BUTTON') {
    const taskId = event.target.dataset.id;
    const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")).filter(item => item[0].id != taskId);
    localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));

    loadState(false);
    refreshList();
  }

};


export const toogleCompletedItem = (event) => {

  const isInputCheck = event.target.classList.contains('toggle');

  if (event.target.nodeName === 'INPUT' && isInputCheck) {
    const taskId = event.target.nextSibling.nextSibling.dataset.id;

    const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")).map((value) => {
      const item = value[0];
      if (item.id == taskId) {
        item.completed = !item.completed;
      }
      return value;
    });

    localStorage.setItem('mydayapp-js', JSON.stringify(getLocalStorage));

    refreshList();


  }

}

export const editingItem = (event) => {

  const nodeList = event.target.parentNode.parentNode;
  const isNotNodeCompleted = !nodeList.classList.contains('completed');

  if (event.target.nodeName === "LABEL" && isNotNodeCompleted) {
    nodeList.classList.add('editing');
    nodeFooter.classList.add('hidden');
    const nodeInput = nodeList.lastElementChild;
    nodeInput.focus();
    console.log(nodeInput.value)

  }
}



export const refreshList = () => {

  todoList.innerHTML = '';

  const getLocalStorage = JSON.parse(localStorage.getItem("mydayapp-js")) || [];

  const listTask = getLocalStorage.map(value => {
    const item = value[0];
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

}