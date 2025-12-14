import { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { FaEdit, FaTrash, FaSave, FaTimes, FaCheck } from 'react-icons/fa';

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
    if (newTitle.trim()) {
      updateTodo(todo._id, { title: newTitle });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div className="todo-card slide-in">
      <div className="todo-checkbox">
        <input
          type="checkbox"
          id={`todo-${todo._id}`}
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="custom-checkbox"
        />
        <label htmlFor={`todo-${todo._id}`} className="checkbox-label">
          <FaCheck className="check-icon" />
        </label>
      </div>

      <div className="todo-content">
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="todo-edit-input"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <span
            className={`todo-title ${todo.completed ? 'completed' : ''}`}
          >
            {todo.title}
          </span>
        )}
        
        <span className={`badge ${todo.completed ? 'badge-success' : 'badge-pending'}`}>
          {todo.completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-icon btn-success" title="Save">
              <FaSave />
            </button>
            <button onClick={handleCancel} className="btn-icon btn-secondary" title="Cancel">
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-icon btn-edit" title="Edit">
              <FaEdit />
            </button>
            <button onClick={handleDelete} className="btn-icon btn-delete" title="Delete">
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;

