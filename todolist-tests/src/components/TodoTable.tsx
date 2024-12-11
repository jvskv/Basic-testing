import './TodoTable.css';
import { ToDo } from './types';

interface Props {
  todos: readonly ToDo[];
  remove: (i: number) => void;
}

function TodoTable({ todos, remove }: Props) {

  return (
    todos?.length ? (
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {
            todos.map((todo, index) =>
              <tr key={index}>
                <td id="todo_list">{todo.desc}</td>
                <td>{new Date(todo.date).toLocaleDateString()}</td>
                <td><button onClick={() => remove(index)} >Delete</button></td>
              </tr>)
          }
        </tbody>
      </table>
    ) : (
      <p>No todos</p>
    )
  )
};

export default TodoTable;