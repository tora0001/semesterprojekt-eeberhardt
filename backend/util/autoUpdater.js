// AutoUpdater.js
import cron from 'node-cron';
import VacationController from '../controllers/vacationController.js';
import EmployeeController from '../controllers/employeeController.js';

class AutoUpdater {
    static async updateVacationStatus() {
        try {
            const allVacations = await VacationController.getAllVacationsForAutoUpdater();
            const allEmployees = await EmployeeController.getAllEmployeesForAutoUpdater();

            for (const vacation of allVacations) {
                // Your logic to check if the vacation is ongoing
                const today = new Date();
                const startDate = new Date(vacation.startDate);
                const endDate = new Date(vacation.endDate);

                if (today >= startDate && today <= endDate) {
                    // Vacation is ongoing, update employee status
                    const employeeId = vacation.employee_id;
                    const relatedEmployee = allEmployees.find((employee) => employee.employee_id === employeeId);

                    if (relatedEmployee && relatedEmployee.status_id !== 2) {
                        console.log("relatedEmployee status: " + relatedEmployee.status_id);
                        // Update the employee status to 'on vacation'
                        await EmployeeController.updateEmployeeStatusAsync(employeeId, 2);
                        console.log(`Updated status for employee ${employeeId} to 'on vacation'`);
                    }
                } else if(today > endDate || today < startDate) {
                    // Vacation has ended, update employee status
                    const employeeId = vacation.employee_id;
                    const relatedEmployee = allEmployees.find((employee) => employee.employee_id === employeeId);

                    if (relatedEmployee && relatedEmployee.status_id !== 1) {
                        // Update the employee status to 'active'
                        await EmployeeController.updateEmployeeStatusAsync(employeeId, 1);
                        console.log(`Updated status for employee ${employeeId} to 'active'`);
                    }
                }
            }

            //console.log('Vacation status updated successfully');
        } catch (error) {
            console.error('Failed to update vacation status:', error);
        }
    }

    static async deleteExpiredVacations() {
        try {
            const allVacations = await VacationController.getAllVacationsForAutoUpdater();

            for (const vacation of allVacations) {
                const today = new Date();
                const endDate = new Date(vacation.endDate);

                if (today > endDate) {
                    // Delete the vacation
                    await VacationController.deleteVacationAsync(vacation.vacation_id);
                    console.log(`Deleted vacation ${vacation.vacation_id}`);
                }
            }

            console.log('Expired vacations deleted successfully');
        } catch (error) {
            console.error('Failed to delete expired vacations:', error);
        }
    }

    static async addEmployeeVacationDays() {
        try {
            const allEmployees = await EmployeeController.getAllEmployeesForAutoUpdater();
            console.log(allEmployees);

            for (const employee of allEmployees) {
                const employeeId = employee.employee_id;
                const vacationDays = employee.vacation_days + 2.0833333333;
                console.log(employeeId + vacationDays);


                // Update the employee's vacation days with 2.0833333333
                await EmployeeController.updateVacationDaysAsync(employeeId, vacationDays);
                console.log(`Updated vacation days for employee ${employeeId} to ${vacationDays}`);
            }

            console.log('Vacation days updated successfully');
        } catch (error) {
            console.error('Failed to update vacation days:', error);
        }
    }
        

    static startCronJobDaily() {
        // 0 4 * * *   # Minute: 0, Hour: 4, Every day, Every month, Any day of the week
        cron.schedule('0 4 * * *', () => {
            this.deleteExpiredVacations();
            this.updateVacationStatus();
        });
    }

    static startCronJobMonthly() {
        // 0 4 1 * *   # Minute: 0, Hour: 4, Day of month: 1, Every month, Any day of the week
        cron.schedule('0 4 1 * *', () => {
            this.addEmployeeVacationDays();
        });
    }
}

// Start the cron job when the module is imported
//AutoUpdater.startCronJob();
AutoUpdater.startCronJobDaily();
AutoUpdater.startCronJobMonthly();

export default AutoUpdater;
