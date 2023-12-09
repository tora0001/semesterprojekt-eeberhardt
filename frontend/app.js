"use strict";
let employees = [];
let vacations = [];
let roles = [];
let roleList = [];

//brug dette endpoint for at teste med azure
// const endpoint = "https://semesterprojekt-eeberhardt.azurewebsites.net";

//brug dette endpoint for at teste lokalt

const endpoint = "http://localhost:4000";

window.addEventListener("load", start);

function start() {
   console.log("Running");

   // Fetch roles and update the roleList
   refreshRoleList();

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
          <th id="employeeTableName" onclick="sortTableByName()">Navn</th>
          <th id="employeeTableRole" onclick="sortTableByRole()">Stilling</th>
          <th id="employeeTableStatus" onclick="sortTableByStatus()">Status</th>
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

   const employeeTableNameHeader = document.getElementById("employeeTableName");
   employeeTableNameHeader.dataset.employeeData = JSON.stringify(employeeData);

   const employeeTableRoleHeader = document.getElementById("employeeTableRole");
   employeeTableRoleHeader.dataset.employeeData = JSON.stringify(employeeData);

   const employeeTableStatusHeader = document.getElementById("employeeTableStatus");
   employeeTableStatusHeader.dataset.employeeData = JSON.stringify(employeeData);
}

function sortTableByName() {
   const employeeDataString = document.getElementById("employeeTableName").dataset.employeeData;
   const employeeData = JSON.parse(employeeDataString);

   employeeData.sort((a, b) => a.name.localeCompare(b.name));

   populateEmployeeTable(employeeData);
}

function sortTableByRole() {
   const employeeDataString = document.getElementById("employeeTableRole").dataset.employeeData;
   const employeeData = JSON.parse(employeeDataString);

   employeeData.sort((a, b) => a.role_name.localeCompare(b.role_name));

   populateEmployeeTable(employeeData);
}

function sortTableByStatus() {
   const employeeDataString = document.getElementById("employeeTableStatus").dataset.employeeData;
   const employeeData = JSON.parse(employeeDataString);

   employeeData.sort((a, b) => a.status.localeCompare(b.status));

   populateEmployeeTable(employeeData);
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
      <select type="text" id="employeeRole" name="employeeRole" required>
      ${roles.map(element => `<option value="${element.role_id}">${element.role_name}</option>`).join('')}
      </select>

      <label for="vacationDays">Feriedage Til Rådighed:</label>
      <input type="text" id="vacationDays" name="vacationDays" required>

      <div class="buttons">
        <button type="button" onclick="createEmployee('create')">Opret</button>
        <button type="button" onclick="refreshEmployeeList()">Annuller</button>
      </div>
    </form>`;

   mainContent.innerHTML = formHTML;
}

function createEmployee() {
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
      .then(() => {
         refreshEmployeeList();
      });
}

function editEmployee(employeeId) {
   const foundEmployee = employees.find((employee) => employee.employee_id === employeeId);
   const updateForm = /*HTML*/ `
    <form id="updateEmployeeForm">
      <label for="employeeName">Navn:</label>
      <input type="text" id="employeeNameUpdate" name="employeeName" required value="${foundEmployee.name}">

      <label for="employeeRoleUpdate">Stilling:</label>
      <select type="text" id="employeeRoleUpdate" name="employeeRole" required>
         ${roles.map(element => `<option value="${element.role_id}" ${element.role_id === foundEmployee.role_id ? 'selected' : ''}>${element.role_name}</option>`).join('')}
      </select>

      <label for="vacationDays">Feriedage Til Rådighed:</label>
      <input type="text" id="vacationDaysUpdate" name="vacationDays" required value="${foundEmployee.vacation_days}">

      <div class="buttons">
        <button type="button" id="confirmBtn">Gem</button>
        <button type="button" id="cancelBtn">Annuller</button>
      </div>
    </form>`;

   mainContent.innerHTML = updateForm;

   const confirmBtn = document.getElementById("confirmBtn");
   const cancelBtn = document.getElementById("cancelBtn");

   confirmBtn.onclick = function () {
      console.log("confirmBtn clicked");
      performEditEmployee(employeeId);
      refreshEmployeeList();
   };

   cancelBtn.onclick = function () {
      console.log("cancelBtn clicked");
      refreshEmployeeList();
   };
}

function performEditEmployee(employeeId) {

   const employeeName = document.getElementById("employeeNameUpdate").value;
   const employeeRole = document.getElementById("employeeRoleUpdate").value;
   const vacationDays = document.getElementById("vacationDaysUpdate").value;
   const employeeStatus = 1;

   const employeeData = {
      name: employeeName,
      role_id: employeeRole,
      vacation_days: vacationDays,
      status_id: employeeStatus,
   };

   const url = `${endpoint}/employee/${employeeId}`;
   const method = "PUT";

   fetch(url, {
      method: method,
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
   })
      .then((response) => response.json())
      .then(() => {
         refreshEmployeeList();
      });
}

function deleteEmployee(employeeId) {
   const confirmationModalHTML = /*HTML*/ `
    <div id="confirmationModal" class="modal">
      <div id="modalContent" class="modal-content">
        Er du sikker på at du vil fjerne denne medarbejder?
      </div>
      <div class="modal-buttons">
        <button id="confirmBtn" class="buttons">Ja</button>
        <button id="cancelBtn" class="buttons">Nej</button>
      </div>
    </div>
  `;

   mainContent.innerHTML = confirmationModalHTML;

   const modal = document.getElementById("confirmationModal");
   const confirmBtn = document.getElementById("confirmBtn");
   const cancelBtn = document.getElementById("cancelBtn");

   modal.style.display = "block";

   confirmBtn.onclick = function () {
      closeModal();
      performDeleteEmployee(employeeId);
   };

   cancelBtn.onclick = function () {
      closeModal();
      refreshEmployeeList();
   };

   function closeModal() {
      modal.style.display = "none";
   }
}

function performDeleteEmployee(employeeId) {
   const url = `${endpoint}/employee/${employeeId}`;
   const method = "DELETE";

   fetch(url, {
      method: method,
   })
      .then((response) => response.json())
      .then(() => {
         refreshEmployeeList();
      });
}

function addNewVacation() {
   fetch(`${endpoint}/employees`)
      .then((response) => response.json())
      .then((employeeData) => {
         const employeeSelectOptions = employeeData
            .map(
               (employee) => /*HTML*/ `
        <option value="${employee.employee_id}">${employee.name}</option>
      `
            )
            .join("");

         const formHTML = /*HTML*/ `
    <form id="vacationForm">
      <label for="employeeSelect">Employee:</label>
      <select id="employeeSelect" name="employeeSelect">
        ${employeeSelectOptions}
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
      });
}
function editVacation() {}

function performEditVacation() {}

function deleteVacation(vacationId) {
   const confirmationModalHTML = /*HTML*/ `
    <div id="confirmationModal" class="modal">
      <div id="modalContent" class="modal-content">
        Er du sikker på at du vil fjerne denne ferie?
      </div>
      <div class="modal-buttons">
        <button id="confirmBtn" class="buttons">Ja</button>
        <button id="cancelBtn" class="buttons">Nej</button>
      </div>
    </div>
  `;

   mainContent.innerHTML = confirmationModalHTML;

   const modal = document.getElementById("confirmationModal");
   const confirmBtn = document.getElementById("confirmBtn");
   const cancelBtn = document.getElementById("cancelBtn");

   modal.style.display = "block";

   confirmBtn.onclick = function () {
      closeModal();
      performDeleteVacation(vacationId);
   };
   cancelBtn.onclick = function () {
      closeModal();
      refreshVacationList();
   };
   function closeModal() {
      modal.style.display = "none";
   }
}

function performDeleteVacation(vacationId) {
   const url = `${endpoint}/vacation/${vacationId}`;
   const method = "DELETE";

   fetch(url, {
      method: method,
   })
      .then((response) => response.json())
      .then(() => {
         refreshVacationList();
      });
}
function refreshRoleList() {
    fetch(`${endpoint}/roles`)
        .then((response) => response.json())
        .then((data) => {
          roles = data;
        });
}

function saveVacation() {
  const employeeSelect = document.getElementById("employeeSelect");
  const employeeId = employeeSelect.options[employeeSelect.selectedIndex].value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const vacationData = {
    employee_id: employeeId,
    startDate: startDate,
    endDate: endDate,
  };

  const url = `${endpoint}/vacation`;
  const method = "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vacationData),
  })
    .then((response) => response.json())
    .then(() => {
      refreshVacationList();
    });
}

function deleteVacation(vacationId) {
  const confirmationModalHTML = /*HTML*/ `
    <div id="confirmationModal" class="modal">
      <div id="modalContent" class="modal-content">
        Are you sure you want to delete this vacation?
      </div>
      <div class="modal-buttons">
        <button id="confirmBtn" class="buttons">Yes</button>
        <button id="cancelBtn" class="buttons">No</button>
      </div>
    </div>
  `;

  mainContent.innerHTML = confirmationModalHTML;

  const modal = document.getElementById("confirmationModal");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  modal.style.display = "block";

  confirmBtn.onclick = function () {
    closeModal();
    performDeleteVacation(vacationId);
  };

  cancelBtn.onclick = function () {
    closeModal();
    refreshVacationList();
  };

  function closeModal() {
    modal.style.display = "none";
  }
}

function editVacation(vacationId) {
  fetch(`${endpoint}/vacation/${vacationId}`)
    .then((response) => response.json())
    .then((vacationData) => {
      const formHTML = /*HTML*/ `
    <form id="vacationForm">
      <label for="employeeSelect">Employee:</label>
      <select id="employeeSelect" name="employeeSelect">
        <option value="${vacationData.employee_id}">${vacationData.name}</option>
      </select>

      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" name="startDate" value="${formatDate(vacationData.startDate)}" required>

      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" name="endDate" value="${formatDate(vacationData.endDate)}" required>

      <div class="buttons">
        <button type="button" onclick="saveVacation(${vacationId}, 'edit')">Save</button>
        <button type="button" onclick="cancelForm()">Cancel</button>
      </div>
    </form>`;

      mainContent.innerHTML = formHTML;
    });
}

function refreshEmployeeList() {
   fetch(`${endpoint}/employees`)
      .then((response) => response.json())
      .then((data) => {
         employees = data;
         populateEmployeeTable(employees);
      });
}

function refreshVacationList() {
   fetch(`${endpoint}/vacations`)
      .then((response) => response.json())
      .then((data) => {
         vacations = data;
         populateVacationTable(vacations);
      });
}

function formatDate(inputDate) {
   const dateObject = new Date(inputDate);
   const formattedDate = dateObject.toISOString().split("T")[0];
   return formattedDate;
}