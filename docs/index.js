"use strict";
let currentDetail = null;
/** ====== cấu hình chế độ chạy ====== */
const API_URL = 'http://localhost:3001/api/todos';
const IS_PAGES = /github\.io$/.test(location.host) || /\.github\.io\//.test(location.href);
const STATIC_DATA_URL = './data/todos.json'; // file tĩnh trong docs/data/
const STORAGE_KEY = 'todos';
/** ====== DOM ====== */
const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const descInput = document.getElementById('desc-input');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupDesc = document.getElementById('popup-desc');
const popupView = document.getElementById('popup-view');
const editBtn = document.getElementById('edit-btn');
const popupEdit = document.getElementById('popup-edit');
const editTitle = document.getElementById('edit-title');
const editDesc = document.getElementById('edit-desc');
const cancelEdit = document.getElementById('cancel-edit');
/** ====== tiện ích localStorage cho chế độ Pages ====== */
function getLocalTodos() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function setLocalTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
function nextId(todos) {
    return todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
}
/** ====== API cục bộ (backend) ====== */
async function apiList() {
    const res = await fetch(API_URL);
    if (!res.ok)
        throw new Error('Fetch todos failed');
    return (await res.json());
}
async function apiGet(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok)
        throw new Error('Todo not found');
    return (await res.json());
}
async function apiCreate(data) {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, description: data.description })
    });
}
async function apiUpdate(id, patch) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
    });
}
async function apiDelete(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
/** ====== “API” cho GitHub Pages (tĩnh + localStorage) ====== */
async function pagesList() {
    // ưu tiên dữ liệu đã lưu trên trình duyệt
    const cached = getLocalTodos();
    if (cached.length)
        return cached;
    // lần đầu: seed từ ./data/todos.json
    const res = await fetch(STATIC_DATA_URL);
    if (!res.ok)
        return [];
    const data = (await res.json());
    setLocalTodos(data);
    return data;
}
async function pagesGet(id) {
    const todos = getLocalTodos();
    const t = todos.find(x => x.id === id);
    if (!t)
        throw new Error('Todo not found');
    return t;
}
async function pagesCreate(data) {
    const todos = getLocalTodos();
    const newTodo = {
        id: nextId(todos),
        title: data.title,
        description: data.description ?? '',
        completed: false
    };
    todos.push(newTodo);
    setLocalTodos(todos);
}
async function pagesUpdate(id, patch) {
    const todos = getLocalTodos();
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1)
        return;
    todos[idx] = { ...todos[idx], ...patch };
    setLocalTodos(todos);
}
async function pagesDelete(id) {
    const todos = getLocalTodos().filter(t => t.id !== id);
    setLocalTodos(todos);
}
/** ====== Facade: chọn backend hay pages tuỳ môi trường ====== */
async function fetchTodos() {
    const todos = IS_PAGES ? await pagesList() : await apiList();
    renderTodos(todos);
}
async function getTodoById(id) {
    return IS_PAGES ? await pagesGet(id) : await apiGet(id);
}
async function createTodo(title, description) {
    return IS_PAGES ? pagesCreate({ title, description }) : apiCreate({ title, description });
}
async function updateTodo(id, patch) {
    return IS_PAGES ? pagesUpdate(id, patch) : apiUpdate(id, patch);
}
async function deleteTodo(id) {
    return IS_PAGES ? pagesDelete(id) : apiDelete(id);
}
/** ====== render ====== */
function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        // Checkbox toggle completed
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = async (e) => {
            e.stopPropagation();
            await updateTodo(todo.id, { completed: !todo.completed });
            fetchTodos();
        };
        li.appendChild(checkbox);
        // Title (click để xem mô tả)
        const titleSpan = document.createElement('span');
        titleSpan.textContent = todo.title;
        titleSpan.style.textDecoration = todo.completed ? 'line-through' : '';
        titleSpan.style.cursor = 'pointer';
        titleSpan.onclick = async () => {
            try {
                const detail = await getTodoById(todo.id);
                currentDetail = detail;
                popupTitle.textContent = detail.title;
                popupDesc.textContent = detail.description || '(Không có mô tả)';
                popupView.style.display = '';
                popupEdit.style.display = 'none';
                popup.setAttribute('data-id', String(detail.id));
                popup.style.display = 'block';
            }
            catch {
                alert('Không tìm thấy công việc này!');
            }
        };
        li.appendChild(titleSpan);
        // Nút xoá
        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.onclick = async (e) => {
            e.stopPropagation();
            await deleteTodo(todo.id);
            fetchTodos();
        };
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
}
/** ====== edit popup handlers (đặt ngoài vòng lặp) ====== */
// Sửa todo
editBtn.onclick = () => {
    if (currentDetail) {
        editTitle.value = currentDetail.title;
        editDesc.value = currentDetail.description;
    }
    popupView.style.display = 'none';
    popupEdit.style.display = 'flex';
    return false;
};
// Huỷ sửa
cancelEdit.onclick = () => {
    popupView.style.display = '';
    popupEdit.style.display = 'none';
    return false;
};
// Lưu sửa
popupEdit.onsubmit = async (e) => {
    e.preventDefault();
    const idStr = popup.getAttribute('data-id');
    if (!idStr)
        return;
    const id = Number(idStr);
    await updateTodo(id, { title: editTitle.value, description: editDesc.value });
    popup.style.display = 'none';
    fetchTodos();
};
/** ====== form add ====== */
todoForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    const description = descInput.value.trim();
    if (!title)
        return;
    await createTodo(title, description);
    todoInput.value = '';
    descInput.value = '';
    fetchTodos();
};
/** ====== khởi động ====== */
fetchTodos();
