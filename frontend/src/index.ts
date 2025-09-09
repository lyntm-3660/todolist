let currentDetail: Todo | null = null;

interface Todo {
	id: number;
	title: string;
	description: string;
	completed: boolean;
}

const API_URL = 'http://localhost:3001/api/todos';

const todoList = document.getElementById('todo-list') as HTMLUListElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const descInput = document.getElementById('desc-input') as HTMLInputElement;
const popup = document.getElementById('popup') as HTMLDivElement;
const popupTitle = document.getElementById('popup-title') as HTMLHeadingElement;
const popupDesc = document.getElementById('popup-desc') as HTMLParagraphElement;
const popupView = document.getElementById('popup-view') as HTMLDivElement;
const editBtn = document.getElementById('edit-btn') as HTMLButtonElement;
const popupEdit = document.getElementById('popup-edit') as HTMLFormElement;
const editTitle = document.getElementById('edit-title') as HTMLInputElement;
const editDesc = document.getElementById('edit-desc') as HTMLTextAreaElement;
const cancelEdit = document.getElementById('cancel-edit') as HTMLButtonElement;

async function fetchTodos() {
	const res = await fetch(API_URL);
	const todos: Todo[] = await res.json();
	renderTodos(todos);
}

function renderTodos(todos: Todo[]) {
	todoList.innerHTML = '';
	todos.forEach(todo => {
		const li = document.createElement('li');
		// Checkbox toggle completed
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = todo.completed;
		checkbox.onclick = async (e) => {
			e.stopPropagation();
			await fetch(`${API_URL}/${todo.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: !todo.completed })
			});
			fetchTodos();
		};
		li.appendChild(checkbox);

		// Title (click để xem mô tả)
		const titleSpan = document.createElement('span');
		titleSpan.textContent = todo.title;
		titleSpan.style.textDecoration = todo.completed ? 'line-through' : '';
		titleSpan.style.cursor = 'pointer';
		titleSpan.onclick = async (e) => {
			const res = await fetch(`${API_URL}/${todo.id}`);
			if (!res.ok) {
				alert('Không tìm thấy công việc này!');
				return;
			}
			const detail: Todo = await res.json();
			currentDetail = detail;
			popupTitle.textContent = detail.title;
			//popupDesc.innerHTML = (detail.description || '(Không có mô tả)').replace(/(?:\r\n|\r|\n)/g, '<br>');
			popupDesc.textContent = detail.description || '(Không có mô tả)';
			popupView.style.display = '';
			popupEdit.style.display = 'none';
			popup.setAttribute('data-id', String(detail.id));
			popup.style.display = 'block';
		};
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
	const id = popup.getAttribute('data-id');
	if (!id) return;
	await fetch(`${API_URL}/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title: editTitle.value, description: editDesc.value })
	});
	popup.style.display = 'none';
	fetchTodos();
};
		li.appendChild(titleSpan);

		// Nút xoá
		const delBtn = document.createElement('button');
		delBtn.textContent = 'X';
		delBtn.onclick = async (e) => {
			e.stopPropagation();
			await fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' });
			fetchTodos();
		};
		li.appendChild(delBtn);

		todoList.appendChild(li);
	});
}


todoForm.onsubmit = async (e) => {
	e.preventDefault();
	const title = todoInput.value.trim();
	const description = descInput.value.trim();
	if (!title) return;
	await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, description })
	});
	todoInput.value = '';
	descInput.value = '';
	fetchTodos();
};

fetchTodos();
