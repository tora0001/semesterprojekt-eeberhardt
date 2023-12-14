// employee.js

function populateEmployeeTable(employeeData) {
  mainContent.innerHTML = /*HTML*/ `
     <h2>Ansat Oversigt</h2>
     <table id="employeeTable">
       <thead>
         <tr>
           <th id="employeeTableName" onclick="sortTableByName()">Navn</th>
           <th id="employeeTableRole" onclick="sortTableByRole()">Stilling</th>
           <th id="employeeTableStatus" onclick="sortTableByStatus()">Status</th>
           <th id="employeeTableVacationDays">Feriedage</th>
           <th>Handlinger</th>
         </tr>
       </thead>
       <tbody>
         ${employeeData
           .map(
             (employee) => /*HTML*/ `
                 <tr>
                     <td>${employee.name}</td>
                     <td>${employee.role_name}</td>
                     <td>${employee.status}</td>
                     <td>${employee.vacation_days}</td>
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

function addNewEmployee() {
  const formHTML = /*HTML*/ `
     <form id="employeeForm"  onsubmit="createEmployee(); return false;">
       <label for="employeeName">Navn:</label>
       <input type="text" id="employeeName" name="employeeName" required maxlength="50">
 
       <label for="employeeRole">Stilling:</label>
       <select type="text" id="employeeRole" name="employeeRole" required>
       ${roles.map((element) => `<option value="${element.role_id}">${element.role_name}</option>`).join("")}
       </select>
 
       <label for="vacationDays">Feriedage Til Rådighed:</label>
       <input type="text" id="vacationDays" name="vacationDays" required>
 
       <div class="buttons">
         <button type="submit">Opret</button>
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
     <form id="updateEmployeeForm" onsubmit="performEditEmployee(${employeeId}); return false;">
       <label for="employeeName">Navn:</label>
       <input type="text" id="employeeNameUpdate" name="employeeName" required value="${foundEmployee.name}">
 
       <label for="employeeRoleUpdate">Stilling:</label>
       <select type="text" id="employeeRoleUpdate" name="employeeRole" required>
          ${roles.map((element) => `<option value="${element.role_id}" ${element.role_id === foundEmployee.role_id ? "selected" : ""}>${element.role_name}</option>`).join("")}
       </select>
 
       <label for="vacationDays">Feriedage Til Rådighed:</label>
       <input type="text" id="vacationDaysUpdate" name="vacationDays" required value="${foundEmployee.vacation_days}">
 
       <div class="buttons">
         <button type="submit">Gem</button>
         <button type="button" onclick="refreshEmployeeList();">Annuller</button>
       </div>
     </form>`;

  mainContent.innerHTML = updateForm;
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

function editEmployeeClicked(employee) {
  console.log(employee);
  const update = document.querySelector("#updateEmployeeForm");

  update.employeeNameUpdate.value = employee.name;
  update.employeeRoleUpdate.value = employee.role_name;
}

// Include other employee-related functions as needed
