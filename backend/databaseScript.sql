use `eeberhardt-ferier`;

Create table roles (
    role_id int NOT NULL AUTO_INCREMENT,
    role_name varchar(255),
    primary key (role_id)
);

Create table status (
    status_id int NOT NULL AUTO_INCREMENT,
    status varchar(255),
    primary key (status_id)
);

Create table employee(
    employee_id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    role_id int,
    vacation_days int,
    status_id int,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (status_id) REFERENCES status(status_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

create table vacation(
    vacation_id int NOT NULL AUTO_INCREMENT,
    employee_id int,
    startDate DATE,
    endDate DATE,
    PRIMARY KEY (vacation_id),
    foreign key (employee_id) REFERENCES employee(employee_id)
);

drop table vacationHistory;
create table vacationHistory(
    vacationHistory_id int NOT NULL AUTO_INCREMENT,
    vacation_id int,
    startDate DATE,
    endDate DATE,
    PRIMARY KEY (vacationHistory_id)
);

-- opdaterer antallet af feriedage for den ansatte som har fået oprettet en ferie
DELIMITER //
CREATE TRIGGER update_vacation_days
AFTER INSERT ON vacation
FOR EACH ROW
BEGIN
    DECLARE vacation_duration INT;

    -- Calculate the duration of the vacation
    SET vacation_duration = DATEDIFF(NEW.endDate, NEW.startDate) + 1;

    -- Update the vacation_days in the employee table
    UPDATE employee
    SET vacation_days = vacation_days - vacation_duration
    WHERE employee_id = NEW.employee_id;
END //
DELIMITER ;

-- når en ferie er overstået, flyttes den til ferie-historikken.
DELIMITER //
CREATE TRIGGER move_completed_vacation_to_history
AFTER DELETE ON vacation
FOR EACH ROW
BEGIN
    DECLARE vacation_duration INT;

    -- Calculate the duration of the vacation being deleted
    SET vacation_duration = DATEDIFF(OLD.endDate, OLD.startDate) + 1;

    -- Check if the vacation is completed (you can customize this condition)
    IF OLD.endDate < CURDATE() THEN
        -- Move the completed vacation to vacationHistory
        INSERT INTO vacationHistory (vacation_id, startDate, endDate)
        VALUES (OLD.vacation_id, OLD.startDate, OLD.endDate);
    END IF;
END //
DELIMITER ;

-- hvis en ferie slettes, skal feriedagene sættes tilbage til den ansatte
DELIMITER //
CREATE TRIGGER restore_vacation_days
BEFORE DELETE ON vacation
FOR EACH ROW
BEGIN
    DECLARE vacation_duration INT;

    -- Check if the vacation is not completed
    IF OLD.endDate >= CURDATE() THEN
        -- Calculate the duration of the vacation being deleted
        SET vacation_duration = DATEDIFF(OLD.endDate, OLD.startDate) + 1;

        -- Check if triggers are enabled
        IF @TRIGGER_DISABLED IS NULL OR @TRIGGER_DISABLED = FALSE THEN
            -- Create a temporary table to hold the data to be updated
            CREATE TEMPORARY TABLE temp_employee_update
            SELECT employee_id, vacation_days + vacation_duration AS new_vacation_days
            FROM employee
            WHERE employee_id = OLD.employee_id;

            -- Update the employee table from the temporary table
            UPDATE employee
            SET vacation_days = (SELECT new_vacation_days FROM temp_employee_update)
            WHERE employee_id = OLD.employee_id;

            -- Drop the temporary table
            DROP TEMPORARY TABLE IF EXISTS temp_employee_update;
        END IF;
    END IF;
END //
DELIMITER ;


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


DELIMITER //

DELIMITER //
CREATE TRIGGER remove_employee_vacations
BEFORE DELETE ON employee
FOR EACH ROW
BEGIN
    -- Deaktiver trigger midlertidigt
    SET @TRIGGER_DISABLED = TRUE;

    -- Slet ferier tilhørende den ansatte
    DELETE FROM vacation
    WHERE employee_id = OLD.employee_id;

    -- Aktiver trigger igen
    SET @TRIGGER_DISABLED = FALSE;
END //

DELIMITER ;
