import express from 'express';
import roleController from '../controllers/roleController.js';

const router = express.Router();

router.get('/roles', roleController.getAllRoles);
// router.get('/role/:role_id', roleController.getRoleById);
// router.post('/role', roleController.createRole);
// router.put('/role/:role_id', roleController.updateRole);
// router.delete('/role/:role_id', roleController.deleteRole);
// Define other routes for employees

export default router;