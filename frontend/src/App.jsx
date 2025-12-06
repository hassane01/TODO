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
import LongTaskMonitor from '../LongTaskMonitor';

function App() {
  const [todos, setTodos] = useState([]);
  const { user } = useContext(AuthContext); // Get user from AuthContext

  


  useEffect(() => {
    // Run only on client
    if (import.meta.env.DEV) {
      const [navigationTiming] = performance.getEntriesByType("navigation");

      if (navigationTiming instanceof PerformanceNavigationTiming) {
        const pageLoadTime =
          navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;

        console.log("DOM Content Loaded Time:", pageLoadTime, "ms");
        console.log("DNS lookup:", navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart, "ms");
        console.log("TTFB:", navigationTiming.responseStart - navigationTiming.requestStart, "ms");
      }
    }
  }, []);

 

  const fetchTodos = useCallback(async () => {
    const start = performance.now()
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
    const end  = performance.now()
    console.log(`execution time is : ${end - start}ms`);
    
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Re-fetch when user changes

  return (
    <>
    {import.meta.env.DEV && <LongTaskMonitor/>}
      <Router>
        <div className="container">
          <Header /> {/* Add Header here */}
          <Routes>
            <Route path='/' element={
              <ProtectedRoute>
                <div className="App">
                  <h1>Todo List</h1>
                  <TodoForm setTodos={setTodos} />
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