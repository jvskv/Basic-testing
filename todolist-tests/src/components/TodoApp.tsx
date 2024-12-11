import { useState, useRef } from 'react';
import TodoTable from './TodoTable';
import TodoInput from './TodoInput';
import Confirm from './Confirm';
import { ToDo } from './types';

function TodoApp() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [pending, setPending] = useState<ToDo|null>(null);

  const modal = useRef<HTMLDialogElement>(null);
  const addTodo = (todo: ToDo) => {
    if (todos.find(item => item.desc === todo.desc && item.date === todo.date)) {
      modal.current!.showModal();
      setPending(todo);
    } else {
      setTodos([...todos, todo]);
    }
  };

  const confirmAdd = (response: boolean) => {
    if (response && pending) {
      setTodos([...todos, pending]);
      setPending(null);
    }
  };

  const removeTodo = (index: number) => setTodos(todos.filter((_, i) => i !== index));

  return (
    <div>
      <TodoInput onValue={addTodo} />
      <TodoTable todos={todos} remove={removeTodo} />
      <Confirm ref={modal}
        onConfirm={confirmAdd}
        text={'The entry is identical with an existing todo. Do you want to keep it?'}
        okLabel={'Keep it'}
        cancelLabel={'Cancel'} />
    </div>
  );
};

export default TodoApp;