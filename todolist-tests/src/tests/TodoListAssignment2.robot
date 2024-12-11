*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${URL}            http://localhost:3000
${BROWSER}        Chrome

*** Test Cases ***

Adding a Single Item
    [Documentation]    Test adding a single item to the Todo list and verify it appears in the list.
    Open Browser       ${URL}    ${BROWSER}

    Table Should Be Empty
    Input Text              id=todo_description_input           Sample task 1
    Input Text              id=todo_date_input                  20.11.2024
    Click Button            Add
    Page Should Contain     Sample task 1
    Page Should Contain     20.11.2024

    Close Browser

Adding Multiple Items
    [Documentation]    Test adding multiple items to the Todo list and verify they appear correctly.
    Open Browser       ${URL}    ${BROWSER}

    # First item
    Table Should Be Empty
    Input Text              id=todo_description_input           Sample task 1
    Input Text              id=todo_date_input                  20.11.2024
    Click Button            Add
    Page Should Contain     Sample task 1
    Page Should Contain     20.11.2024

    # Second item
    Input Text              id=todo_description_input           Sample task 2
    Input Text              id=todo_date_input                  22.11.2024
    Click Button            Add
    Page Should Contain     Sample task 2
    Page Should Contain     22.11.2024

    Close Browser

Removing items
    [Documentation]    Testing removing an item
    Open Browser       ${URL}    ${BROWSER}
    
    # Adding a item
    Table Should Be Empty
    Input Text              id=todo_description_input           Sample task 1
    Input Text              id=todo_date_input                  20.11.2024
    Click Button            Add
    Page Should Contain     Sample task 1
    Page Should Contain     20.11.2024

    # Remove added task
    Click Button            xpath=//td[contains(text(), 'Sample task 1')]/following-sibling::td/button[text()='Delete']

    # Making sure table is empty
    Table Should Be Empty
    Close Browser

Task Count Validation
    [Documentation]    Verify that the task count updates correctly after adding and removing tasks.
    Open Browser       ${URL}    ${BROWSER}

    # Initial State: Ensure the table is empty and count is 0
    Table Should Be Empty

    # Add the first task and verify the count
    Input Text              id=todo_description_input           Sample task 1
    Input Text              id=todo_date_input                  20.11.2024
    Click Button            Add
    Page Should Contain     Sample task 1
    Page Should Contain     20.11.2024
    Verify Task Count       1

    # Add a second task and verify the count
    Input Text              id=todo_description_input           Sample task 2
    Input Text              id=todo_date_input                  22.11.2024
    Click Button            Add
    Page Should Contain     Sample task 2
    Page Should Contain     22.11.2024
    Verify Task Count       2

    # Remove the first task and verify the count
    Click Button            xpath=//td[contains(text(), 'Sample task 1')]/following-sibling::td/button[text()='Delete']
    Verify Task Count       1

    # Remove the second task and verify the count
    Click Button            xpath=//td[contains(text(), 'Sample task 2')]/following-sibling::td/button[text()='Delete']
    Table Should Be Empty

    Close Browser

Testing Validation
    [Documentation]    Test adding an empty item to ensure validation.
    Open Browser       ${URL}    ${BROWSER}

    Table Should Be Empty
    Input Text              id=todo_description_input           ${EMPTY}
    Input Text              id=todo_date_input                  ${EMPTY}
    Click Button            Add
    Table Should Be Empty
    Close All Browsers

Testing Duplicate Alert
    [Documentation]    Testing if the duplicate alert pops up
    Open Browser       ${URL}    ${BROWSER}
    
    # Adding the item
    Table Should Be Empty
    Input Text                  id=todo_description_input           Sample task 1
    Input Text                  id=todo_date_input                  20.11.2024
    Click Button                Add
    Page Should Contain         Sample task 1
    Page Should Contain         20.11.2024
    
    # Adding the duplicate item
    Input Text                  id=todo_description_input           Sample task 1
    Input Text                  id=todo_date_input                  20.11.2024
    Click Button                Add

    Wait Until Page Contains    The entry is identical with an existing todo. Do you want to keep it?

    Close All Browsers

Testing Adding Of Duplicate
    [Documentation]    Testing adding duplicates and verifying the correct number of duplicates exist in the table.
    Open Browser        ${URL}    ${BROWSER}
    
    # Duplicate counter
    ${duplicate_count}=    Set Variable    0

    # Adding the first item and increasing the counter
    Table Should Be Empty
    Input Text                  id=todo_description_input           Sample task 1
    Input Text                  id=todo_date_input                  20.11.2024
    Click Button                Add
    Page Should Contain         Sample task 1
    Page Should Contain         20.11.2024
    ${duplicate_count}=    Evaluate    ${duplicate_count} + 1

    # Adding 3 duplicates in a loop
    FOR    ${i}     IN RANGE    3
        Input Text                  id=todo_description_input           Sample task 1
        Input Text                  id=todo_date_input                  20.11.2024
        Click Button                Add

        # Duplicate alert check
        Wait Until Page Contains    The entry is identical with an existing todo. Do you want to keep it?

        # Clicking "Keep it" to adpd
        Click Button                xpath=//button[text()='Keep it']

        # Adding to the counter
        ${duplicate_count}=    Evaluate    ${duplicate_count} + 1
    END
    
    # Verifying the duplicate count
    Verify Duplicate Count    Sample task 1    ${duplicate_count}

Testing Multiple Duplicates
    [Documentation]    Testing the adding of duplicates for two different tasks and verifying the correct number of duplicates
    Open Browser       ${URL}    ${BROWSER}
    
    # Duplicate counters
    ${duplicate_count_1}=    Set Variable    0
    ${duplicate_count_2}=    Set Variable    0
    
    # Adding the first task and increasing the counter
    Input Text                  id=todo_description_input           Sample task 1
    Input Text                  id=todo_date_input                  20.11.2024
    Click Button                Add
    ${duplicate_count_1}=      Evaluate    ${duplicate_count_1} + 1

    # Adding the second task and increasing the counter
    Input Text                  id=todo_description_input           Sample task 2
    Input Text                  id=todo_date_input                  22.11.2024
    Click Button                Add
    ${duplicate_count_2}=      Evaluate    ${duplicate_count_2} + 1

    # Add duplicates for both tasks
    FOR    ${i}    IN RANGE    3  # Adding 3 duplicates for each task

        # Adding duplicate of task 1
        Input Text                  id=todo_description_input           Sample task 1
        Input Text                  id=todo_date_input                  20.11.2024
        Click Button                Add
        Wait Until Page Contains    The entry is identical with an existing todo. Do you want to keep it?
        Click Button                xpath=//button[text()='Keep it']
        ${duplicate_count_1}=      Evaluate    ${duplicate_count_1} + 1

        # Adding duplicate of task 2
        Input Text                  id=todo_description_input           Sample task 2
        Input Text                  id=todo_date_input                  22.11.2024
        Click Button                Add
        Wait Until Page Contains    The entry is identical with an existing todo. Do you want to keep it?
        Click Button                xpath=//button[text()='Keep it']
        ${duplicate_count_2}=      Evaluate    ${duplicate_count_2} + 1
    END

    # Verifying duplicate count for both tasks
    Verify Duplicate Count         Sample task 1    ${duplicate_count_1}
    Verify Duplicate Count         Sample task 2    ${duplicate_count_2}

    Close All Browsers

*** Keywords ***

Table Should Be Empty
    [Documentation]    Verifying that the Todo list is empty by checking for the "No todos" message.
    Page Should Contain Element    xpath=//p[text()='No todos']

Verify Task Count
    [Arguments]    ${expected_count}
    Wait Until Element Is Visible    xpath=//table//tbody    timeout=5s
    ${row_count}=    Get Element Count    xpath=//table//tbody/tr
    Should Be Equal As Integers    ${row_count}    ${expected_count}

Verify Duplicate Count
    [Arguments]    ${task_description}    ${expected_count}
    ${row_count}=    Get Element Count    xpath=//td[text()='${task_description}']
    Log To Console    Found ${row_count} rows with description: ${task_description}
    Should Be Equal As Integers    ${row_count}    ${expected_count}