import "./css/base.css";

import { refreshList, addTodoItems, loadState } from "./js/utils";
import { newTodo, nodeLabel, todoList } from "./js/nodes";

loadState();
refreshList();
newTodo.addEventListener('change', addTodoItems);

