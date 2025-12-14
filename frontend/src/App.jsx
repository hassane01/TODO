import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Header from './components/Header'; // Import Header
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';
import LongTaskMonitor from '../LongTaskMonitor';
import { usePageLoadMetrics } from './hooks/usePageLoadMetrics';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  usePageLoadMetrics(); // Use the custom hook

  return (
    <>
      {import.meta.env.DEV && <LongTaskMonitor />}
      <Router>
        <div className="container">
          <Header /> {/* Add Header here */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path='/' element={
                <ProtectedRoute>
                  <div className="App">
                    <h1>Todo List</h1>
                    <TodoForm />
                    <TodoList />
                  </div>
                </ProtectedRoute>
              } />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;