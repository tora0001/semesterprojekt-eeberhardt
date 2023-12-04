"use strict";
let employees = [];
let vacations = [];

const endpoint = "http://localhost:4000";

window.addEventListener("load", start);

function start() {
  console.log("Running");
  
  // Initial content to show
  refreshEmployeeList();
}

document.addEventListener("DOMContentLoaded", function () {
  const employeePage = document.getElementById("employeePage");
  const vacationPage = document.getElementById("vacationPage");
  const mainContent = document.getElementById("mainContent");

  employeePage.addEventListener("click", function () {
    refreshEmployeeList();
  });

  vacationPage.addEventListener("click", function () {
    refreshVacationList();
  });

});

function populateEmployeeTable(employeeData) {
  mainContent.innerHTML = `
    <h2>Ansat Oversigt</h2>
    <table id="employeeTable">
      <thead>
        <tr>
          <th>Medarbejder ID</th>
          <th>Navn</th>
          <th>Stilling</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${employeeData
          .map(
            (employee) => `
                <tr>
                    <td>${employee.employee_id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.role_name}</td>
                    <td>${employee.status}</td>
                    <td>
                      <button onclick="editEmployee(${employee.employee_id})">Rediger</button>
                      <button onclick="deleteEmployee(${employee.employee_id})">Slet</button>
                    </td>
                </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

function populateVacationTable(vacationData) {
  mainContent.innerHTML = `
    <h2>Ferie Oversigt</h2>
    <table id="vacationTable">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through vacationData to populate rows -->
        ${vacationData
          .map(
            (vacation) => `
                <tr>
                    <td>${vacation.name}</td>
                    <td>${formatDate(vacation.startDate)}</td>
                    <td>${formatDate(vacation.endDate)}</td>
                    <td>
                      <button onclick="editVacation(${vacation.vacation_id})">Rediger</button>
                      <button onclick="deleteVacation(${vacation.vacation_id})">Slet</button>
                    </td>
                </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div class="buttons">
      <button onclick="addNewVacation()">Add New Vacation</button>
    </div>`;
}

function addNewEmployee() {
  const formHTML = `
    <form id="employeeForm">
      <label for="employeeName">Name:</label>
      <input type="text" id="employeeName" name="employeeName" required>

      <label for="employeeRole">Role:</label>
      <input type="text" id="employeeRole" name="employeeRole" required>

      <label for="employeeStatus">Status:</label>
      <input type="text" id="employeeStatus" name="employeeStatus" required>

      <div class="buttons">
        <button type="button" onclick="saveEmployee('create')">Save</button>
        <button type="button" onclick="cancelForm()">Cancel</button>
      </div>
    </form>`;

  mainContent.innerHTML = formHTML;
}

function addNewVacation() {
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
        <button type="button" onclick="saveVacation('create')">Save</button>
        <button type="button" onclick="cancelForm()">Cancel</button>
      </div>
    </form>`;

  mainContent.innerHTML = formHTML;
}


function refreshEmployeeList() {
  fetch(`${endpoint}/employee`)
    .then((response) => response.json())
    .then((data) => {
      employees = data;
      populateEmployeeTable(employees);
    })
    .catch((error) => console.error('Error fetching employees:', error));
}

function refreshVacationList() {
  fetch(`${endpoint}/vacation`)
    .then((response) => response.json())
    .then((data) => {
      vacations = data;
      populateVacationTable(vacations);
    })
    .catch((error) => console.error('Error fetching employees:', error));
}

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);
  const formattedDate = dateObject.toISOString().split('T')[0];
  return formattedDate;
}

