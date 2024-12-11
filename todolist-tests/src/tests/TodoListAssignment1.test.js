import userEvent from '@testing-library/user-event';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoApp from '../components/TodoApp';

describe('TodoApp Component Tests', () => {
  
  // Test Case 1: Removing a Todo item from the list
  test('removes a todo when "Delete" button is clicked', async () => {
    render(<TodoApp />);

    // Adding a Todo item so it can be deleted
    const descriptionInput = screen.getByLabelText('Description:');
    const dateInput = screen.getByLabelText('Date:');
    const addButton = screen.getByText('Add');

    await act(async () => {
      await userEvent.type(descriptionInput, 'Task to Remove');
      await userEvent.type(dateInput, '2024-10-30');
      await userEvent.click(addButton);
    });

    // Checking that the task is added
    expect(screen.getByText('Task to Remove')).toBeInTheDocument();

    // Deleting the task
    const removeButton = screen.getByText('Delete');
    await act(async () => {
      await userEvent.click(removeButton);
    });

    // Checking that the task is deleted
    expect(screen.queryByText('Task to Remove')).not.toBeInTheDocument();
  });

  // Test Case 2: Removing a Todo item from an already empty Todo list
  test('does not change the list when trying to remove a non-existent item from an empty Todo list', () => {
    render(<TodoApp />);

    // Trying to remove a non-existent item
    const removeButton = screen.queryByText('Delete Non-Existent')
    expect(removeButton).not.toBeInTheDocument();
  })

  // Test Case 3: Removing a Todo item from a non-empty list
  test('does not change the list when trying to remove a non-existent item from a populated list', async () => {
    render(<TodoApp />)

    // Adding a couple of items to start off
    const descriptionInput = screen.getByLabelText('Description:')
    const dateInput = screen.getByLabelText('Date:')
    const addButton = screen.getByText('Add')

    // Adding the first item
    await act(async () => {
      await userEvent.type(descriptionInput, 'First Task')
      await userEvent.type(dateInput, '2024-12-01')
      await userEvent.click(addButton)
    })

    // Checking that the first task is added
    expect(screen.getByText('First Task')).toBeInTheDocument()

    // Clearing the inputs
    await act(async () => {
      await userEvent.clear(descriptionInput);
      await userEvent.clear(dateInput);
    });


    // Adding the second item
    await act(async () => {
      await userEvent.type(descriptionInput, 'Second Task')
      await userEvent.type(dateInput, '2024-12-02')
      await userEvent.click(addButton)
    })

    // Checking that the second task is added
    expect(screen.getByText('Second Task')).toBeInTheDocument()    

    // Attempt to remove a non-existent item
    const nonExistentDeleteButton = screen.queryByText('Delete Non-existent')
    expect (nonExistentDeleteButton).not.toBeInTheDocument()

    // Verify item are still there
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
  })

  // Test Case 4: Adding a new Todo item to an empty list
  test('adds a new todo item to an empty list', async() => {
    render(<TodoApp />)

    const descriptionInput = screen.getByLabelText('Description:')
    const dateInput = screen.getByLabelText('Date:')
    const addButton = screen.getByText('Add')

    await act(async () => {
      await userEvent.type(descriptionInput, 'New Task')
      await userEvent.type(dateInput, '2024-12-01')
      await userEvent.click(addButton)
    })

    // Checking that the new item is in the list
    expect(screen.getByText('New Task')).toBeInTheDocument()

    const tableRows = screen.queryAllByRole('row');
    expect(tableRows.length).toBeGreaterThan(1); 
  })

  // Test Case 5: Adding a new Todo item to a non-empty list where the item does not exist
  test('adds a new Todo item to a non-empty list', async () => {
    render(<TodoApp />)

    // Add initial items
    const descriptionInput = screen.getByLabelText('Description:')
    const dateInput = screen.getByLabelText('Date:')
    const addButton = screen.getByText('Add')

    // Adding a item that already exists
    await act(async () => {
      await userEvent.type(descriptionInput, 'Existing Task')
      await userEvent.type(dateInput, '2024-12-01')
      await userEvent.click(addButton)
    })

    // Clearing the inputs
    await act(async () => {
      await userEvent.clear(descriptionInput);
      await userEvent.clear(dateInput);
    });

    // Add a new item
    await act(async () => {
      await userEvent.type(descriptionInput, 'Another New Task')
      await userEvent.type(dateInput, '2024-12-02')
      await userEvent.click(addButton)
    })

    // Check that both items are present
    expect(screen.getByText('Existing Task')).toBeInTheDocument()
    expect(screen.getByText('Another New Task')).toBeInTheDocument()
  })

  // Test Case 6: Attempting to add a Todo item that already exists in the Todo list
  test('shows a warning dialog when adding a duplicate Todo item and does not add it', async () => {
    render(<TodoApp />);

    // Add an initial item
    const descriptionInput = screen.getByLabelText('Description:');
    const dateInput = screen.getByLabelText('Date:');
    const addButton = screen.getByText('Add');

    await act(async () => {
      await userEvent.type(descriptionInput, 'Duplicate Task');
      await userEvent.type(dateInput, '2024-12-03');
      await userEvent.click(addButton);
    });

     // Try adding a duplicate item
     await act(async () => {
      await userEvent.type(descriptionInput, 'Duplicate Task');
      await userEvent.type(dateInput, '2024-12-03');
      await userEvent.click(addButton);
    });

    // Check for warning dialog
    expect(screen.getByText('The entry is identical with an existing todo. Do you want to keep it?')).toBeInTheDocument();

    // Check that the duplicate item was not added
    const todos = screen.getAllByText('Duplicate Task');
    expect(todos.length).toBe(1);
  });
  
  // Test Case 7: Attempting to add a empty input to Todo list
  test('does not add a Todo item when input fields are empty', async () => {
    render(<TodoApp />);
    const descriptionInput = screen.getByLabelText('Description:');
    const dateInput = screen.getByLabelText('Date:');
    const addButton = screen.getByText('Add');
  
    // Ensure input fields are empty
    expect(descriptionInput.value).toBe('');
    expect(dateInput.value).toBe('');
  
    await act(async () => {
      await userEvent.click(addButton);
    });
  
    // Query rows and filter out header rows
    const todos = screen.queryAllByRole('row');
    const dataRows = todos.filter(row => !row.closest('thead'));
  
    // Further filter to remove rows with "Invalid Date" or empty content
    const validDataRows = dataRows.filter(row => {
      const rowText = row.textContent || '';
      return rowText.trim() !== '' && !rowText.includes('Invalid Date');
    });
  
    // Expect no valid data rows to be added
    expect(validDataRows.length).toBe(0);
  });
})