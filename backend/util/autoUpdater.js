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

                    if (relatedEmployee && relatedEmployee.status !== 2) {
                        // Update the employee status to 'on vacation'
                        await EmployeeController.updateEmployeeStatusAsync(employeeId, 2);
                        console.log(`Updated status for employee ${employeeId} to 'on vacation'`);
                    }
                }
            }

            console.log('Vacation status updated successfully');
        } catch (error) {
            console.error('Failed to update vacation status:', error);
        }
    }

    static async updateEmployeeStatus() {
        try {
            // Your auto-update logic here
            const allVacations = await VacationController.getAllVacationsForAutoUpdater();
            const allEmployees = await EmployeeController.getAllEmployeesForAutoUpdater();
            for (const employee of allEmployees) {
                //console.log(employee);
            }

            console.log('Employee status updated successfully');
        } catch (error) {
            console.error('Failed to update employee status:', error);
        }
    }

    static startCronJob() {
        // Schedule auto-update every 10 seconds
        cron.schedule('*/10 * * * * *', () => {
            this.updateVacationStatus();
            this.updateEmployeeStatus();
        });
    }

    static startCronJobMonthly() {
    // Schedule auto-update on the 1st day of every month at midnight (00:00:00)
    cron.schedule('0 0 1 * *', () => {
        this.updateVacationStatus();
        this.updateEmployeeStatus();
    });
}
}

// Start the cron job when the module is imported
AutoUpdater.startCronJob();
AutoUpdater.startCronJobMonthly();

export default AutoUpdater;
