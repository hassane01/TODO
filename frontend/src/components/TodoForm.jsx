import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState('');
  const { addTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    addTodo({ title: newTodo });
    setNewTodo('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TodoForm;
