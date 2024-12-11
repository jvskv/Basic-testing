import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import TodoInput from './components/TodoInput';

// Tarvittaessa voit käyttää jest mock:ia muiden komponenttien mockaamiseen
// jest.mock('../SomeDirectory/SomeComponent', () => 'SomeComponent');

test('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
});

describe('show input fields', () => {
  test('task input descrption', () => {
    render(<TodoInput onValue={(todo) => console.log(todo)} />);
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
  });

  test('task input sending', async () => {
    render(<TodoInput onValue={(todo) => console.log(todo)} />);
    await userEvent.click(screen.getByText('Add'));
  });
});
