const createElement = (element, content = '') => {
  const tag = document.createElement(element);
  tag.textContent = content;

  return tag;
};

const strikeContent = (isDone, content, status) => {
  if (isDone) {
    status.innerText = 'undone';
    content.style.textDecoration = "line-through";
  }

};

const createBlock = (task) => {
  const temp = document.querySelector("#taskTemp");
  let clon = temp.content.cloneNode(true);
  const div = clon.querySelector(".class-task");
  div.id = task.id;
  const p = clon.querySelector("p");
  p.textContent = task.taskName;
  const status = clon.querySelector("#status");
  status.textContent = "Done";
  strikeContent(task.isDone, p, status);

  return clon;
};

const removeTask = async (child, listId) => {
  await fetch(`/list/${listId}/task/${child.parentElement.id}`, { method: "DELETE" });

  const todos = await getToDoLists();
  showTodoLists(todos);
};

const toggleTask = async (child, listId) => {
  await fetch(`/list/${listId}/task/${child.parentElement.id}`, { method: "PATCH" });

  const todos = await getToDoLists();
  showTodoLists(todos);
};

const handleRemoveButton = (listId) => {
  const removeButtons = document.querySelectorAll("#remove");

  removeButtons.forEach((button) => {
    if (!button.dataset.listenerAdded) {
      button.dataset.listenerAdded = "true";
      button.addEventListener("click", () => removeTask(button, listId));
    }
  });
};

const handleStatusButton = (listId) => {
  const statusButtons = document.querySelectorAll("#status");

  statusButtons.forEach((button) => {
    if (!button.dataset.listenerAdded) {
      button.dataset.listenerAdded = "true";
      button.addEventListener("click", () => toggleTask(button, listId));
    }
  });
};

const showTodos = (todos) => {
  const outer = document.createElement('div');
  todos.forEach((task) => {
    const block = createBlock(task);
    outer.appendChild(block);
  });

  return outer;
};

const addTask = async (event, task) => {
  event.preventDefault();
  const taskName = new FormData(event.target).get("taskName");
  const data = JSON.stringify({ taskName: taskName });
  const res = await fetch(`/todo/task/${task.parentElement.id}`, { method: "POST", headers: { "content-Type": "application/json" }, body: data });
  task.reset();

  const todos = await getToDoLists();
  showTodoLists(todos);
};

const getToDoLists = async () => {
  const res = await fetch("/todolist");
  if (res.redirected) {
    globalThis.location.href = res.url
  }

  const listDetails = await res.json();
  return listDetails;
};

const createList = (task, list) => {
  const temp = document.getElementById("listTemp");
  let clon = temp.content.cloneNode(true);
  const div = clon.querySelector(".class-list");
  div.id = task.id;
  const h1 = clon.querySelector("h1");
  h1.textContent = task.listName;
  const form = clon.querySelector("form");
  form.id = `form${task.id}`;

  list.appendChild(clon);
  const inputs = document.getElementById(`form${task.id}`);
  inputs.addEventListener('submit', (event) => addTask(event, inputs));

  return div;
};

const removeList = async (list) => {
  await fetch(`/todo/list/${list.parentElement.id}`, { method: "DELETE" });

  const todos = await getToDoLists();
  showTodoLists(todos);
};

const handleListDeletion = () => {
  const remove = document.querySelectorAll("#listDel");

  remove.forEach((button) => {
    button.addEventListener('click', () => removeList(button));
  });
};

const showTodoLists = (lists) => {
  const todo = lists.tasks;
  const tag = document.getElementById("username");
  tag.textContent = lists.name;
  const list = document.querySelector('#todo');
  list.innerText = '';

  todo.forEach(task => {
    const div = createList(task, list);
    const tasks = showTodos(task.tasks);
    div.appendChild(tasks);
    handleRemoveButton(div.id);
    handleStatusButton(div.id);
    list.appendChild(div);
  });

  handleListDeletion();
};

const addList = async (event, list) => {
  event.preventDefault();
  const listName = new FormData(event.target).get("listName");
  const data = JSON.stringify({ listName });
  await fetch(`/todo/list`, {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: data
  });
  list.reset();

  const todos = await getToDoLists();
  showTodoLists(todos);
};

const logOut = async (event, button) => {
  event.preventDefault();

  await fetch("/deleteUser", { method: "POST" });
};

const main = async () => {
  const todolists = await getToDoLists();
  showTodoLists(todolists);
  const list = document.getElementById("list");
  list.addEventListener('submit', (event) => addList(event, list));
  const button = document.getElementById("logout");
  button.addEventListener('submit', (event) => (event, button));
};

globalThis.onload = main;