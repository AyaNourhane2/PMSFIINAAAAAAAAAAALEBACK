import { fetchMessages, fetchMessagesByUser, createMessage, editMessage, removeMessage } from '../services/messageService.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await fetchMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByUser = async (req, res) => {
  try {
    const { user } = req.params;
    const messages = await fetchMessagesByUser(user);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const message = req.body;
    const result = await createMessage(message);
    res.status(201).json({ id: result.insertId, ...message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await editMessage(id, content);
    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await removeMessage(id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};