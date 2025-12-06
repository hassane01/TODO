import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy ,Suspense , useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Header from './components/Header'; // Import Header
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';
import LongTaskMonitor from '../LongTaskMonitor';

const Login = lazy(()=> import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'));

function App() {
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

  return (
    <>
    {import.meta.env.DEV && <LongTaskMonitor/>}
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