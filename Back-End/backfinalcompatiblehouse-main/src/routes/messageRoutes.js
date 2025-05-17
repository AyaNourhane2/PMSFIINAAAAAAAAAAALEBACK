import express from 'express';
import { getMessages, getMessagesByUser, addMessage, updateMessage, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.get('/user/:user', getMessagesByUser);
router.post('/', addMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;