
import express, { Request, Response } from 'express';
import cors from 'cors';
import { getTodos, getTodoById, addTodo, updateTodo, deleteTodo } from './todo';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('To Do List API is running!');
});

// Get all todos
app.get('/api/todos', (req: Request, res: Response) => {
  res.json(getTodos());
});

// Add a new todo

// Add a new todo (with description)
app.post('/api/todos', (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const todo = addTodo(title, description || '');
  res.status(201).json(todo);
});
// Get a single todo by id
app.get('/api/todos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = getTodoById(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// Update a todo

// Update a todo (title, description, completed)
app.put('/api/todos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = updateTodo(id, req.body);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ok = deleteTodo(id);
  if (!ok) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
