import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header'; // Import Header
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import AuthContext from './context/AuthContext'; // Import AuthContext
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const fetchTodos = useCallback(async () => {
    if (!user) {
      console.log('No user, skipping fetch');
      return;
    }

    if (!user.token) {
      console.error('User exists but no token:', user);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get('/api/todos', config);
      setTodos(res.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Re-fetch when user changes

  return (
    <>
      <Router>
        <div className="container">
          <Header /> {/* Add Header here */}
          <Routes>
            <Route path='/' element={
              <ProtectedRoute>
                <div className="App">
                  <h1>Todo List</h1>
                  <TodoForm fetchTodos={fetchTodos} />
                  <TodoList todos={todos} fetchTodos={fetchTodos} />
                </div>
              </ProtectedRoute>
            } />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;