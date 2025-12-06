import TodoItem from './TodoItem';
import { useTodos } from '../context/TodoContext';

const TodoList = () => {
  const { todos } = useTodos();

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
