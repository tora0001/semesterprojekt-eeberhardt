"use strict";
let employees = [];
let vacations = [];

//brug dette endpoint for at teste med azure
// const endpoint = "https://semesterprojekt-eeberhardt.azurewebsites.net";

//brug dette endpoint for at teste lokalt

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
  mainContent.innerHTML = /*HTML*/ `
    <h2>Ansat Oversigt</h2>
    <table id="employeeTable">
      <thead>
        <tr>
          <th>Medarbejder ID</th>
          <th>Navn</th>
          <th>Stilling</th>
          <th>Status</th>
          <th>Handlinger</th>
        </tr>
      </thead>
      <tbody>
        ${employeeData
          .map(
            (employee) => /*HTML*/ `
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
    </table>
    <div class="buttons">
    <button onclick="addNewEmployee()">Opret Ny Medarbejder</button>
    </div>`;
}

function populateVacationTable(vacationData) {
  mainContent.innerHTML = /*HTML*/ `
    <h2>Ferie Oversigt</h2>
    <table id="vacationTable">
      <thead>
        <tr>
          <th>Medarbejder</th>
          <th>Start Dato</th>
          <th>Slut Dato</th>
          <th>Handlinger</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through vacationData to populate rows -->
        ${vacationData
          .map(
            (vacation) => /*HTML*/ `
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
      <button onclick="addNewVacation()">Opret Ny Ferie</button>
    </div>`;
}

function addNewEmployee() {
  const formHTML = /*HTML*/ `
    <form id="employeeForm">
      <label for="employeeName">Navn:</label>
      <input type="text" id="employeeName" name="employeeName" required>

      <label for="employeeRole">Stilling:</label>
      <input type="text" id="employeeRole" name="employeeRole" required>

      <label for="vacationDays">Feriedage Til Rådighed:</label>
      <input type="text" id="vacationDays" name="vacationDays" required>

      <div class="buttons">
        <button type="button" onclick="saveEmployee('create')">Opret</button>
        <button type="button" onclick="cancelForm()">Annuller</button>
      </div>
    </form>`;

  mainContent.innerHTML = formHTML;
}

function saveEmployee() {
  const employeeName = document.getElementById("employeeName").value;
  const employeeRole = document.getElementById("employeeRole").value;
  const vacationDays = document.getElementById("vacationDays").value;
  const employeeStatus = 1;

  const employeeData = {
    name: employeeName,
    role_id: employeeRole,
    vacation_days: vacationDays,
    status_id: employeeStatus,
  };

  const url = `${endpoint}/employee`;
  const method = "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Employee saved:", data);

      refreshEmployeeList();
    })
    .catch((error) => console.error("Error saving employee:", error));
}

function deleteEmployee(employeeId) {
  const confirmDelete = confirm("Er du sikker på at du vil fjerne denne medarbejder?");

  if (confirmDelete) {
    const url = `${endpoint}/employee/${employeeId}`;
    const method = "DELETE";

    fetch(url, {
      method: method,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Employee deleted:", data);

        refreshEmployeeList();
      })
      .catch((error) => console.error("Error deleting employee:", error));
  }
}

function addNewVacation() {
  const formHTML = /*HTML*/ `
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
  fetch(`${endpoint}/employees`)
    .then((response) => response.json())
    .then((data) => {
      employees = data;
      populateEmployeeTable(employees);
    })
    .catch((error) => console.error("Error fetching employees:", error));
}

function refreshVacationList() {
  fetch(`${endpoint}/vacations`)
    .then((response) => response.json())
    .then((data) => {
      vacations = data;
      populateVacationTable(vacations);
    })
    .catch((error) => console.error("Error fetching employees:", error));
}

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);
  const formattedDate = dateObject.toISOString().split("T")[0];
  return formattedDate;
}
