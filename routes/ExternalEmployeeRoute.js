import express from "express";
import {
    getExternalEmployees,
    getExternalEmployeeById,
    createExternalEmployee,
    updateExternalEmployee,
    deleteExternalEmployee,
    getExternalEmployeeCount,
    getExternalEmployeeDetails
} from "../controllers/ExternalEmployees.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/externalEmployees', getExternalEmployees);
router.get('/externalEmployeeDetails', getExternalEmployeeDetails);
router.get('/externalEmployees/count', getExternalEmployeeCount);
router.get('/externalEmployees/:id', getExternalEmployeeById);
router.post('/externalEmployees', verifyUser, adminOnly, createExternalEmployee);
router.patch('/externalEmployees/:id', verifyUser, adminOnly, updateExternalEmployee);
router.delete('/externalEmployees/:id', verifyUser, adminOnly, deleteExternalEmployee);

export default router;