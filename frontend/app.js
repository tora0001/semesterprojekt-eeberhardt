"use strict";

//brug dette endpoint for at teste med azure
// const endpoint = "https://semesterprojekt-eeberhardt.azurewebsites.net";

//brug dette endpoint for at teste lokalt
const endpoint = "http://localhost:4000";

window.addEventListener("load", start);

function start() {
  console.log("running");
  updateEmployeeGrid();
}

async function updateEmployeeGrid() {
  const employees = await getEmployees();
  showEmployees(employees);
}

async function showEmployees() {}

async function getEmployees() {
  const response = await fetch(`${endpoint}/employee`);
  const data = await response.json();
  console.log(data);
  return data;
}
