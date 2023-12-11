// roleController.js
import { connection } from '../util/database.js';

class RoleController {
    // get all roles, /roles
    getAllRoles(req, res) {
        const query = 'SELECT * FROM roles';
    
        connection.query(query, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
        });
    }
}

export default new RoleController();