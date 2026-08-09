import express from "express";

import {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  assignMaintenanceToStaff
} from "../Controllers/maintenanceController.js";

const router = express.Router();

router.post("/", createMaintenance);

router.get("/", getAllMaintenance);

// assign task to staff
router.put("/assign/:id", assignMaintenanceToStaff);

router.get("/:id", getMaintenanceById);

router.put("/:id", updateMaintenance);

router.delete("/:id", deleteMaintenance);

export default router;