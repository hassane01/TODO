import TodoItem from './TodoItem';
import { useTodos } from '../context/TodoContext';

const TodoList = () => {
  const { todos } = useTodos();

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-message">No todos yet! Add one to get started 🚀</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default TodoList;
