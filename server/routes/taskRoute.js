import express from "express";
import {
    createSubTask,
    createTask,
    dashboardStatistics,
    deleteRestoreTask,
    duplicateTask,
    getSingleTask,
    getAllTask,
    postTaskActivity,
    trashTask,
    changeSubTaskStatus,
    updateTask,
    changeTaskStage,
} from "../controllers/taskController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createTask);
router.post("/duplicate/:id", protectRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", getAllTask);
router.get("/:id", protectRoute, getSingleTask);

router.put("/create-subtask/:id", protectRoute, createSubTask);
router.put("/update/:id", protectRoute, updateTask);
router.put("/change-stage/:id", protectRoute, changeTaskStage);
router.put(
    "/change-status/:taskId/:subTaskId",
    protectRoute,
    changeSubTaskStatus
);
router.put("/:id", protectRoute, trashTask);

router.delete(
    "/delete-restore/:id",
    protectRoute,
    deleteRestoreTask
);

export default router;
