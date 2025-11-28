import { createContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER':
      return { user: action.payload };
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage

  const initialState = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Validate it's a real user object, not an error
        if (parsed && parsed.token && parsed.email) {
          return { user: parsed };
        }
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
    return { user: null };
  })();

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && !state.user) {
        const parsed = JSON.parse(storedUser);
        // Validate it's a real user object, not an error
        if (parsed && parsed.token && parsed.email) {
          dispatch({ type: 'LOGIN', payload: parsed });
        } else {
          // If invalid, clear it
          localStorage.removeItem('user');
        }
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem('user');
    }
  }, []);

  // Login user
  const login = async (userData) => {
    try {
      const user = await authService.login(userData);
      // Validate the response has required fields
      if (!user || !user.token || !user.email) {
        throw new Error('Invalid response from server');
      }
      dispatch({ type: 'LOGIN', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
      throw error;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const user = await authService.register(userData);
      // Validate the response has required fields
      if (!user || !user.token || !user.email) {
        throw new Error('Invalid response from server');
      }
      dispatch({ type: 'REGISTER', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;