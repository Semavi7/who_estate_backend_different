const express = require('express');
const ClientIntake = require('../models/ClientIntake');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/client-intake:
 *   post:
 *     summary: Create a new client intake
 *     tags: [Client Intake]
 *     security:
 *       - cookieAuth: []
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
 *               - propertyType
 *               - budget
 *               - location
 *               - timeline
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
 *               propertyType:
 *                 type: string
 *               budget:
 *                 type: string
 *               location:
 *                 type: string
 *               timeline:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client intake created successfully
 */
router.post('/', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const createDto = req.body;

    const newClientIntake = new ClientIntake(createDto);
    await newClientIntake.save();

    res.status(201).json(newClientIntake);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/client-intake:
 *   get:
 *     summary: Get all client intakes
 *     tags: [Client Intake]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of client intakes
 */
router.get('/', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const clientIntakes = await ClientIntake.find();
    res.json(clientIntakes);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/client-intake/{id}:
 *   get:
 *     summary: Get client intake by ID
 *     tags: [Client Intake]
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
 *         description: Client intake details
 *       404:
 *         description: Client intake not found
 */
router.get('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const clientIntake = await ClientIntake.findById(id);
    if (!clientIntake) {
      return res.status(404).json({ message: 'Mesaj Bulunamadı' });
    }

    res.json(clientIntake);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/client-intake/{id}:
 *   patch:
 *     summary: Update client intake
 *     tags: [Client Intake]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               propertyType:
 *                 type: string
 *               budget:
 *                 type: string
 *               location:
 *                 type: string
 *               timeline:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client intake updated successfully
 *       404:
 *         description: Client intake not found
 */
router.patch('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateDto = req.body;

    const clientIntake = await ClientIntake.findById(id);
    if (!clientIntake) {
      return res.status(404).json({ message: 'Mesaj Bulunamadı' });
    }

    // Update fields
    for (const key in updateDto) {
      if (updateDto[key] !== undefined) {
        clientIntake[key] = updateDto[key];
      }
    }

    await clientIntake.save();
    res.json(clientIntake);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/client-intake/{id}:
 *   delete:
 *     summary: Delete client intake
 *     tags: [Client Intake]
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
 *         description: Client intake deleted successfully
 *       404:
 *         description: Client intake not found
 */
router.delete('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await ClientIntake.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Kayıt Bulunamadı.' });
    }

    res.json({ message: 'Kayıt başarı ile silindi' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;