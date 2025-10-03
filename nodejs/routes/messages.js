const express = require('express');
const Message = require('../models/Message');
const { authorizeRoles } = require('../middleware/auth');
const { validateCreateMessage } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateCreateMessage, async (req, res, next) => {
  try {
    const createDto = req.body;

    const newMessage = new Message(createDto);
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get message by ID
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message details
 *       404:
 *         description: Message not found
 */
router.get('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Mesaj Bulunamadı' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
router.delete('/:id', authorizeRoles('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await Message.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Mesaj Bulunamadı.' });
    }

    res.json({ message: 'Mesaj başarı ile silindi' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   patch:
 *     summary: Mark message as read
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message marked as read
 *       404:
 *         description: Message not found
 */
router.patch('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Mesaj Bulunamadı' });
    }

    message.isread = true;
    await message.save();

    res.json(message);
  } catch (error) {
    next(error);
  }
});

module.exports = router;