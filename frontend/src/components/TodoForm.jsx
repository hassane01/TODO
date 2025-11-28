import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TodoForm = ({ fetchTodos }) => {
  const [newTodo, setNewTodo] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    if (!user) {
      console.error('User not authenticated.');
      return;
    }

    if (!user.token) {
      console.error('Token is missing. User:', user);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post('/api/todos', { title: newTodo }, config);
      
      setNewTodo('');
      fetchTodos(); // Refetch todos to update the list
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
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
