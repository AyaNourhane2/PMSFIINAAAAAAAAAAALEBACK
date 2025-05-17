import express from 'express';
import { getHousekeepingTasks, addHousekeepingTask, updateHousekeepingTaskStatus } from '../controllers/housekeepingTaskController.js';

const router = express.Router();

router.get('/', getHousekeepingTasks);
router.post('/', addHousekeepingTask);
router.put('/:id', updateHousekeepingTaskStatus);

export default router;