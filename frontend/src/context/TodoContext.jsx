
import { createContext, useState, useContext, useEffect } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';

const TodoContext = createContext();

export const useTodos = ()=>{
    return useContext(TodoContext)
}



export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('/api/todos', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user]);

    const addTodo = async (todo) => {
        // Optimistic update
        const newTodo = { ...todo, _id: Date.now().toString(), completed: false };
        setTodos(prevTodos => [newTodo, ...prevTodos]);

        try {
            await axios.post('/api/todos', todo, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            fetchTodos(); // Re-fetch to get the actual state from the server
        } catch (error) {
            console.error('Failed to add todo:', error);
            // Rollback on error
            setTodos(prevTodos => prevTodos.filter(t => t._id !== newTodo._id));
        }
    };

    const deleteTodo = async (id) => {
        const originalTodos = todos;
        // Optimistic update
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));

        try {
            await axios.delete(`/api/todos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
        } catch (error) {
            console.error('Failed to delete todo:', error);
            // Rollback on error
            setTodos(originalTodos);
        }
    };

    const updateTodo = async (id, updates) => {
        const originalTodos = todos;
        // Optimistic update
        setTodos(prevTodos => prevTodos.map(todo =>
            todo._id === id ? { ...todo, ...updates } : todo
        ));

        try {
            await axios.put(`/api/todos/${id}`, updates, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
        } catch (error) {
            console.error('Failed to update todo:', error);
            // Rollback on error
            setTodos(originalTodos);
        }
    };

    return (
        <TodoContext.Provider value={{ todos, fetchTodos, addTodo, deleteTodo, updateTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export default TodoContext;
