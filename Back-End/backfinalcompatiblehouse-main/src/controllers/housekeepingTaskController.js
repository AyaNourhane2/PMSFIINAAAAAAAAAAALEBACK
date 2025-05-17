import { fetchHousekeepingTasks, createHousekeepingTask, updateHousekeepingTask } from '../services/housekeepingTaskService.js';

export const getHousekeepingTasks = async (req, res) => {
  try {
    const tasks = await fetchHousekeepingTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addHousekeepingTask = async (req, res) => {
  try {
    const task = req.body;
    const result = await createHousekeepingTask(task);
    res.status(201).json({ id: result.insertId, ...task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHousekeepingTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateHousekeepingTask(id, status);
    res.status(200).json({ success: true, message: 'Task status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};