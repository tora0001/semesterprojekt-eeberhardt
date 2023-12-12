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
         <button type="button" id="confirmBtn">Save</button>
         <button type="button" onclick="refreshVacationList()">Cancel</button>
       </div>
     </form>`;
 
          mainContent.innerHTML = formHTML;

          
  const confirmBtn = document.getElementById("confirmBtn");

confirmBtn.onclick = function () {
  console.log("confirmBtn clicked");
  if (validateDates("startDate", "endDate")) {
    saveVacation('create');
  } else {
    alert("End date must be later than start date");
  }
};
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

//  function saveVacation() {
//   const employeeId = document.getElementById("employeeSelect").value;
//   const startDate = document.getElementById("startDate").value;
//   const endDate = document.getElementById("endDate").value;

//   const vacationData = {
//      employee_id: employeeId,
//      startDate: startDate,
//      endDate: endDate,
//   };

//   const url = `${endpoint}/vacation`;
//   const method = "POST";

//   fetch(url, {
//      method: method,
//      headers: {
//         "Content-Type": "application/json",
//      },
//      body: JSON.stringify(vacationData),
//   })
//      .then((response) => response.json())
//      .then(() => {
//         refreshVacationList();
//      });
//   }
 
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

function editVacationClicked(vacation) {
  console.log(vacation);
  const update = document.querySelector("#updateVacationForm");
  console.log(vacation.startDate);

  update.updateStartDate.value = formatDate(vacation.startDate);
  update.updateEndDate.value = formatDate(vacation.endDate);
}

 
//  function editVacationById(vacationId) {
//    fetch(`${endpoint}/vacation/${vacationId}`)
//      .then((response) => response.json())
//      .then((vacationData) => {
//        const formHTML = /*HTML*/ `
//        <form id="vacationForm">
//        <div>
//          <label for="employeeSelect">Employee: ${vacationData[0].name}</label>
//        </div>
//        <br>
//        <div>
//          <label for="startDate">Start Date:</label>
//          <input type="date" id="startDate" name="startDate" value="${formatDate(vacationData[0].startDate)}" required>
//        </div>
//        <br>
//        <div>
//          <label for="endDate">End Date:</label>
//          <input type="date" id="endDate" name="endDate" value="${formatDate(vacationData[0].endDate)}" required>
//        </div>
//        <br>
//        <div class="buttons">
//          <button type="button" onclick="saveVacation(${vacationId}, 'edit')">Save</button>
//          <button type="button" onclick="refreshVacationList()">Cancel</button>
//        </div>
//      </form>
//      `;
//        mainContent.innerHTML = formHTML;
//      });
//  }

 function editVacation(vacationId) {
  console.log(vacations);
  const foundVacation = vacations.find((vacation) => vacation.vacation_id === vacationId);
  console.log(foundVacation);
  const updateVacationForm = /*HTML*/ `
   <form id="updateVacationForm">
     <label for="employeeName">Employee:</label>
     <input type="text" id="employeeName" value="${foundVacation.name}" readonly>

     <label for="startDate">Start Date:</label>
     <input type="date" id="updateStartDate" name="startDate" required>

     <label for="endDate">End Date:</label>
     <input type="date" id="updateEndDate" name="endDate" required>

     <div class="buttons">
       <button type="button" id="confirmBtn">Gem</button>
       <button type="button" id="cancelBtn">Annuller</button>
     </div>
   </form>`;

  mainContent.innerHTML = updateVacationForm;

  editVacationClicked(foundVacation);

  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

confirmBtn.onclick = function () {
  console.log("confirmBtn clicked");
  if (validateDates("updateStartDate", "updateEndDate")) {
    performEditVacation(vacationId, foundVacation);
    refreshVacationList();
  } else {
    alert("End date must be later than start date");
  }
};


  cancelBtn.onclick = function () {
    console.log("cancelBtn clicked");
    refreshVacationList();
 };
}

function performEditVacation(vacationId, vacation) {
  const employeeId = vacation.employee_id;
  const startDate = document.getElementById("updateStartDate").value;
  const endDate = document.getElementById("updateEndDate").value;

  const vacationData = {
     employee_id: employeeId,
     startDate: startDate,
     endDate: endDate,
  };

  const url = `${endpoint}/vacation/${vacationId}`;
  const method = "PUT";

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
 
function validateDates(startDateId, endDateId) {
  const startDate = new Date(document.getElementById(startDateId).value);
  const endDate = new Date(document.getElementById(endDateId).value);

  return startDate < endDate;
}