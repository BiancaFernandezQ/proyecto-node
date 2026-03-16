import { Router } from "express";
import taskController from "../controllers/task.controller.js";

const router = Router();

router.route('/').get(taskController.get).post(taskController.create);
router
    .route('/:id')
    .get(taskController.find)
    .put(taskController.update)
    .patch(taskController.done)
    .delete(taskController.eliminar);

export default router;