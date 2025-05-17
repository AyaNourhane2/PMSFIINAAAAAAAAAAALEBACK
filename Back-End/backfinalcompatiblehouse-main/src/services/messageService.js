import { getMessages, getMessagesByUser, addMessage, updateMessage, deleteMessage } from '../models/messageModel.js';

export const fetchMessages = async () => {
  return await getMessages();
};

export const fetchMessagesByUser = async (user) => {
  return await getMessagesByUser(user);
};

export const createMessage = async (message) => {
  return await addMessage(message);
};

export const editMessage = async (id, content) => {
  return await updateMessage(id, content);
};

export const removeMessage = async (id) => {
  return await deleteMessage(id);
};