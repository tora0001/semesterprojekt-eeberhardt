//vacationController.js
import { connection } from '../util/database.js';

class VacationController {
    // get all vacations, /vacation
    getAllVacations(req, res) {
        const query = 'SELECT * FROM vacation';

        connection.query(query, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.json(results);
            }
        });
    }

    // get vacation data for table view /vacations
    getAllVacationData(req, res) {
        const query = 'SELECT employee.employee_id, employee.name, vacation.vacation_id, vacation.startDate, vacation.endDate FROM employee INNER JOIN vacation ON employee.employee_id = vacation.employee_id;';

        connection.query(query, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.json(results);
            }
        });
    }

    //get vacation by id
    getVacationById(req, res) {
        const id = req.params.vacation_id;
        const query = 'SELECT v.vacation_id, v.employee_id, v.startDate, v.endDate, e.name  FROM vacation v INNER JOIN employee e ON e.employee_id = v.employee_id WHERE vacation_id=?;';
        const values = [id];

        connection.query(query, values, (error, results) => {
            if (error) {
            console.log(error);
            } else {
            res.json(results);
            }
        });
    }

    //create new vacation
    createVacation(req, res) {
        const vacation = req.body;
        const query = "INSERT INTO vacation(employee_id, startDate, endDate) values(?,?,?);";
        const values = [vacation.employee_id, vacation.startDate, vacation.endDate];

        connection.query(query, values, (error, results) => {
            if (error) {
            console.log(error);
            } else {
            res.json(results);
            }
        });
    }

    updateVacation(req, res) {
        const id = req.params.vacation_id;
        const vacation = req.body;
        const query = "UPDATE vacation SET employee_id=?, startDate=?, endDate=? WHERE vacation_id=?;";
        const values = [vacation.employee_id, vacation.startDate, vacation.endDate, id];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        });
    }

    //delete vacation
    deleteVacation(req, res) {
        const id = req.params.vacation_id;
        const query = "DELETE FROM vacation WHERE vacation_id=?;";
        const values = [id];
      
        connection.query(query, values, (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        });
    }

    async getAllVacationsAsync() {
        return new Promise((resolve, reject) => {
                const query = `
                WITH RankedVacations AS (
                    SELECT
                        vacation_id,
                        employee_id,
                        startDate,
                        endDate,
                        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY startDate) AS rnk
                    FROM vacation
                )
                SELECT
                    vacation_id,
                    employee_id,
                    startDate,
                    endDate
                FROM RankedVacations
                WHERE rnk = 1;
            `;

            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    async getAllVacationsForAutoUpdater() {
        try {
            const allVacations = await this.getAllVacationsAsync();
            return allVacations;
        } catch (error) {
            throw error;
        }
    }

    async getUsedVacationDaysForEmployee(employeeId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(DATEDIFF(endDate, startDate)) AS usedVacationDays FROM vacation WHERE employee_id=?;';
            const values = [employeeId];

            connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const usedVacationDays = results[0].usedVacationDays;
                    resolve(usedVacationDays);
                }
            });
        });
    }

    async deleteVacationAsync(vacationId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM vacation WHERE vacation_id=?;';
            const values = [vacationId];

            connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

export default new VacationController();