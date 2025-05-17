import { getHousekeepingTasks, addHousekeepingTask, updateHousekeepingTaskStatus } from '../models/housekeepingTaskModel.js';

export const fetchHousekeepingTasks = async () => {
  return await getHousekeepingTasks();
};

export const createHousekeepingTask = async (task) => {
  return await addHousekeepingTask(task);
};

export const updateHousekeepingTask = async (id, status) => {
  return await updateHousekeepingTaskStatus(id, status);
};