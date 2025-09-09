/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

eval("{\nlet currentDetail = null;\nconst API_URL = 'http://localhost:3001/api/todos';\nconst todoList = document.getElementById('todo-list');\nconst todoForm = document.getElementById('todo-form');\nconst todoInput = document.getElementById('todo-input');\nconst descInput = document.getElementById('desc-input');\nconst popup = document.getElementById('popup');\nconst popupTitle = document.getElementById('popup-title');\nconst popupDesc = document.getElementById('popup-desc');\nconst popupView = document.getElementById('popup-view');\nconst editBtn = document.getElementById('edit-btn');\nconst popupEdit = document.getElementById('popup-edit');\nconst editTitle = document.getElementById('edit-title');\nconst editDesc = document.getElementById('edit-desc');\nconst cancelEdit = document.getElementById('cancel-edit');\nasync function fetchTodos() {\n    const res = await fetch(API_URL);\n    const todos = await res.json();\n    renderTodos(todos);\n}\nfunction renderTodos(todos) {\n    todoList.innerHTML = '';\n    todos.forEach(todo => {\n        const li = document.createElement('li');\n        // Checkbox toggle completed\n        const checkbox = document.createElement('input');\n        checkbox.type = 'checkbox';\n        checkbox.checked = todo.completed;\n        checkbox.onclick = async (e) => {\n            e.stopPropagation();\n            await fetch(`${API_URL}/${todo.id}`, {\n                method: 'PUT',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ completed: !todo.completed })\n            });\n            fetchTodos();\n        };\n        li.appendChild(checkbox);\n        // Title (click để xem mô tả)\n        const titleSpan = document.createElement('span');\n        titleSpan.textContent = todo.title;\n        titleSpan.style.textDecoration = todo.completed ? 'line-through' : '';\n        titleSpan.style.cursor = 'pointer';\n        titleSpan.onclick = async (e) => {\n            const res = await fetch(`${API_URL}/${todo.id}`);\n            if (!res.ok) {\n                alert('Không tìm thấy công việc này!');\n                return;\n            }\n            const detail = await res.json();\n            currentDetail = detail;\n            popupTitle.textContent = detail.title;\n            //popupDesc.innerHTML = (detail.description || '(Không có mô tả)').replace(/(?:\\r\\n|\\r|\\n)/g, '<br>');\n            popupDesc.textContent = detail.description || '(Không có mô tả)';\n            popupView.style.display = '';\n            popupEdit.style.display = 'none';\n            popup.setAttribute('data-id', String(detail.id));\n            popup.style.display = 'block';\n        };\n        // Sửa todo\n        editBtn.onclick = () => {\n            if (currentDetail) {\n                editTitle.value = currentDetail.title;\n                editDesc.value = currentDetail.description;\n            }\n            popupView.style.display = 'none';\n            popupEdit.style.display = 'flex';\n            return false;\n        };\n        // Huỷ sửa\n        cancelEdit.onclick = () => {\n            popupView.style.display = '';\n            popupEdit.style.display = 'none';\n            return false;\n        };\n        // Lưu sửa\n        popupEdit.onsubmit = async (e) => {\n            e.preventDefault();\n            const id = popup.getAttribute('data-id');\n            if (!id)\n                return;\n            await fetch(`${API_URL}/${id}`, {\n                method: 'PUT',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ title: editTitle.value, description: editDesc.value })\n            });\n            popup.style.display = 'none';\n            fetchTodos();\n        };\n        li.appendChild(titleSpan);\n        // Nút xoá\n        const delBtn = document.createElement('button');\n        delBtn.textContent = 'X';\n        delBtn.onclick = async (e) => {\n            e.stopPropagation();\n            await fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' });\n            fetchTodos();\n        };\n        li.appendChild(delBtn);\n        todoList.appendChild(li);\n    });\n}\ntodoForm.onsubmit = async (e) => {\n    e.preventDefault();\n    const title = todoInput.value.trim();\n    const description = descInput.value.trim();\n    if (!title)\n        return;\n    await fetch(API_URL, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ title, description })\n    });\n    todoInput.value = '';\n    descInput.value = '';\n    fetchTodos();\n};\nfetchTodos();\n\n\n//# sourceURL=webpack://frontend/./src/index.ts?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;