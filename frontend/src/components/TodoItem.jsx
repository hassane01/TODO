import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TodoItem = ({ todo, fetchTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const { user } = useContext(AuthContext);

  const config = {
    headers: {
      Authorization: `Bearer ${user ? user.token : ''}`,
    },
  };

  const handleDelete = async () => {
    if (!user) {
      console.error('User not authenticated.');
      return;
    }
    try {
      await axios.delete(`/api/todos/${todo._id}`, config);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  const handleToggleComplete = async () => {
    if (!user) {
      console.error('User not authenticated.');
      return;
    }
    try {
      await axios.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      }, config);
      fetchTodos();
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      console.error('User not authenticated.');
      return;
    }
    try {
      await axios.put(`/api/todos/${todo._id}`, {
        title: newTitle,
      }, config);
      setIsEditing(false);
      fetchTodos();
    } catch (error) {
      console.error('Failed to save todo', error);
    }
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

