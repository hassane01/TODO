import { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { FaPlus } from 'react-icons/fa';

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
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className="todo-input"
      />
      <button type="submit" className="btn-primary btn-add">
        <FaPlus /> Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
