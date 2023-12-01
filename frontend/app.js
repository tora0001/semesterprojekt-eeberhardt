"use strict";

//brug dette endpoint for at teste med azure
// const endpoint = "https://semesterprojekt-eeberhardt.azurewebsites.net";

//brug dette endpoint for at teste lokalt
const endpoint = "http://localhost:4000";

window.addEventListener("load", start);

function start() {
  console.log("Running");
}

document.addEventListener('DOMContentLoaded', function () {
  const employeePage = document.getElementById('employeePage');
  const vacationPage = document.getElementById('vacationPage');
  const mainContent = document.getElementById('mainContent');
  
  let employeesData; // Assume employeesData is an array of employee data fetched from the backend

  document.body.addEventListener('click', function (event) {
      if (event.target.id === 'employeePage') {
      fetchDataFromBackend('/employees')
          .then((employeeData) => {
          employeesData = employeeData; // Store employee data for later use
          showEmployeeTable(employeeData);
          })
          .catch((error) => {
          console.error('Error fetching employee data:', error);
          // Handle error, e.g., display an error message to the user
          });
      } else if (event.target.id === 'vacationPage') {
      fetchDataFromBackend('/vacations')
          .then((vacationData) => {
          showVacationTable(vacationData);
          })
          .catch((error) => {
          console.error('Error fetching vacation data:', error);
          // Handle error, e.g., display an error message to the user
          });
      }
  });

  employeePage.addEventListener('click', function () {
      showEmployeeTable();
  });

  vacationPage.addEventListener('click', function () {
      showVacationTable();
  });

  // Initial content to display
  showEmployeeTable();

  function showEmployeeTable() {
      mainContent.innerHTML = `
          <h2>Ansat Oversigt</h2>
          <table>
          <thead>
              <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              </tr>
          </thead>
          <tbody>
              <tr>
              <td>1</td>
              <td>Ansat 1</td>
              <td>Role A</td>
              <td>Active</td>
              </tr>
              <tr>
              <td>2</td>
              <td>Ansat 2</td>
              <td>Role B</td>
              <td>Inactive</td>
              </tr>
          </tbody>
          </table>
          <div class="buttons">
          <button onclick="showEmployeeForm('edit')">Edit Employee</button>
          <button onclick="showEmployeeForm('create')">Create Employee</button>
          </div>`;
  }

  function showVacationTable() {
      mainContent.innerHTML = `
          <h2>Ferie Oversigt</h2>
          <table>
          <thead>
              <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              </tr>
          </thead>
          <tbody>
              <tr>
              <td>1</td>
              <td>Ansat 1</td>
              <td>2023-01-01</td>
              <td>2023-01-10</td>
              </tr>
              <tr>
              <td>2</td>
              <td>Ansat 2</td>
              <td>2023-02-01</td>
              <td>2023-02-10</td>
              </tr>
          </tbody>
          </table>
          <div class="buttons">
          <button onclick="showVacationForm('edit')">Edit Vacation</button>
          <button onclick="showVacationForm('create')">Create Vacation</button>
          </div>`;
  }

  function showEmployeeForm(action, data) {
      const formHTML = `
          <form id="employeeForm">
          <label for="employeeName">Name:</label>
          <input type="text" id="employeeName" name="employeeName" value="${data.name || ''}" required>

          <label for="employeeRole">Role:</label>
          <input type="text" id="employeeRole" name="employeeRole" value="${data.role || ''}" required>

          <label for="employeeStatus">Status:</label>
          <input type="text" id="employeeStatus" name="employeeStatus" value="${data.status || ''}" required>

          <div class="buttons">
              <button type="button" onclick="saveEmployee('${action}')">Save</button>
              <button type="button" onclick="cancelForm()">Cancel</button>
              ${action === 'edit' ? `<button type="button" onclick="deleteEmployee()">Delete</button>` : ''}
          </div>
          </form>`;

      mainContent.innerHTML = formHTML;
  }

  function showVacationForm(action) {
      const formHTML = `
          <form id="vacationForm">
          <label for="employeeSelect">Employee:</label>
          <select id="employeeSelect" name="employeeSelect">
              <option value="1">Ansat 1</option>
              <option value="2">Ansat 2</option>
              <!-- Add more options as needed -->
          </select>
  
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" required>
  
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" required>
  
          <div class="buttons">
              <button type="button" onclick="saveVacation('${action}')">Save</button>
              <button type="button" onclick="cancelForm()">Cancel</button>
              ${action === 'edit' ? `<button type="button" onclick="deleteVacation()">Delete</button>` : ''}
          </div>
          </form>`;
  
      mainContent.innerHTML = formHTML;
  }

  function saveEmployee(action) {
      // Implement logic to save employee data
      console.log(`Saving ${action === 'edit' ? 'edited' : 'new'} employee data`);
  }

  function saveVacation(action) {
      // Implement logic to save vacation data
      console.log(`Saving ${action === 'edit' ? 'edited' : 'new'} vacation data`);
  }

  function deleteEmployee() {
      // Implement logic to delete employee data
      console.log('Deleting employee data');
  }

  function deleteVacation() {
      // Implement logic to delete vacation data
      console.log('Deleting vacation data');
  }

  function cancelForm() {
      // Implement logic to cancel form and go back to the table view
      showEmployeeTable(); // You may need to update this based on your project structure
  }
});

