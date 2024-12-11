# Testing Project: Todo List Application

The primary goal of this project is to test the functionality and components of a React-based Todo List application. The application serves as a platform for practicing both unit and end-to-end testing. The project includes comprehensive tests implemented with different tools and frameworks, including:

## Testing Tools

  **1. Jest and React Testing Library:**
   - Unit Testing: Ensures the functionality of individual components.
   - Simulates user interactions and verifies DOM elements.
   - Examples of test cases [26]:
    -  Adding, deleting, and handling duplicate tasks.
    - Handling empty input fields.
    
 **2. Robot Framework:**
   - End-to-End Testing: Validates the complete functionality of the application from the user's perspective.
   - Uses the Selenium library to simulate browser interactions.
   - Examples of test cases [28]:
     - Adding a new task.
     - Adding multiple tasks and validating them.
     - Verifying the list is empty initially.
       
  **3. Reporting:**
   - Test results are saved and visualized in report.html and log.html files.
   - XML-based reporting provides a detailed analysis of test execution and outcomes.
   
## Test Scenarios


The tests focus on the following scenarios:

  - Adding and deleting tasks (Jest & Robot Framework).
  - Handling errors, such as empty inputs or duplicate entries.
  - Simulating user actions (e.g., browser-based interactions).
