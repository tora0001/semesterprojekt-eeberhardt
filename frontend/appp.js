// app.js
"use strict";

let employees = [];
let vacations = [];
let roles = [];
let roleList = [];

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


// Include other utility functions and imports as needed
