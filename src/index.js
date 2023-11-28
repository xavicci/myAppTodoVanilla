import "./css/base.css";

import { refreshList, addTodoItems, loadState, selectFilter } from "./js/utils";
import { newTodo, nodeFilters } from "./js/nodes";

loadState();
refreshList();
newTodo.addEventListener('change', addTodoItems);
window.addEventListener('hashchange', selectFilter, false);

