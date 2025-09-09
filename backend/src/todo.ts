export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../todos.json');
export let todos: Todo[] = loadTodos();

function loadTodos(): Todo[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveTodos() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

export function getTodos(): Todo[] {
  return todos;
}

export function getTodoById(id: number): Todo | undefined {
  return todos.find(t => t.id === id);
}

export function addTodo(title: string, description: string): Todo {
  const todo: Todo = {
    id: Date.now(),
    title,
    description,
    completed: false
  };
  todos.push(todo);
  saveTodos();
  return todo;
}

export function updateTodo(id: number, data: Partial<Omit<Todo, 'id'>>): Todo | undefined {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    Object.assign(todo, data);
    saveTodos();
  }
  return todo;
}

export function deleteTodo(id: number): boolean {
  const idx = todos.findIndex(t => t.id === id);
  if (idx !== -1) {
    todos.splice(idx, 1);
    saveTodos();
    return true;
  }
  return false;
}
