import { getStaff, addStaff } from '../models/staffModel.js';

export const fetchStaff = async () => {
  return await getStaff();
};

export const createStaff = async (employee) => {
  return await addStaff(employee);
};