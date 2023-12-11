function formatDate(inputDate) {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateObject.getDate()).padStart(2, '0');
 
    return `${year}-${month}-${day}`;
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