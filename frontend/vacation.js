// vacation.js

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
                       <button onclick="editVacationById(${vacation.vacation_id})">Rediger</button>
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
       <div>
       <label for="employeeSelect">Employee:</label>
       <select id="employeeSelect" name="employeeSelect">
         ${employeeSelectOptions}
           </select>
       </div>
       <br>
       <div>
       <label for="startDate">Start Date:</label>
       <input type="date" id="startDate" name="startDate" required>
       </div>
       <br>
       <div>
       <label for="endDate">End Date:</label>
       <input type="date" id="endDate" name="endDate" required>
       </div>
       
       <div class="buttons">
         <button type="button" onclick="saveVacation('create')">Save</button>
         <button type="button" onclick="cancelForm()">Cancel</button>
       </div>
     </form>`;
 
          mainContent.innerHTML = formHTML;
       });
 }
 
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
 
 function editVacationById(vacationId) {
   fetch(`${endpoint}/vacation/${vacationId}`)
     .then((response) => response.json())
     .then((vacationData) => {
       const formHTML = /*HTML*/ `
       <form id="vacationForm">
       <div>
         <label for="employeeSelect">Employee: ${vacationData[0].name}</label>
       </div>
       <br>
       <div>
         <label for="startDate">Start Date:</label>
         <input type="date" id="startDate" name="startDate" value="${formatDate(vacationData[0].startDate)}" required>
       </div>
       <br>
       <div>
         <label for="endDate">End Date:</label>
         <input type="date" id="endDate" name="endDate" value="${formatDate(vacationData[0].endDate)}" required>
       </div>
       <br>
       <div class="buttons">
         <button type="button" onclick="saveVacation(${vacationId}, 'edit')">Save</button>
         <button type="button" onclick="refreshVacationList()">Cancel</button>
       </div>
     </form>
     `;
       mainContent.innerHTML = formHTML;
     });
 }
 