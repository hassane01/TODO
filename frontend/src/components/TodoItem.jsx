import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const { deleteTodo, updateTodo } = useTodos();

  const handleDelete = () => {
    deleteTodo(todo._id);
  };

  const handleToggleComplete = () => {
    updateTodo(todo._id, { completed: !todo.completed });
  };

  const handleSave = () => {
    updateTodo(todo._id, { title: newTitle });
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      ) : (
        <span
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          onClick={handleToggleComplete}
        >
          {todo.title}
        </span>
      )}
      <span style={{ color: 'black' }}>
        {todo.completed ? 'Completed' : 'pending'}
      </span>

      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
      <button onClick={handleDelete}>X</button>
    </li>
  );
};

export default TodoItem;
