const express = require('express');
const FeatureOption = require('../models/FeatureOption');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/feature-options:
 *   post:
 *     summary: Create a new feature option
 *     tags: [Feature Options]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - value
 *             properties:
 *               category:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feature option created successfully
 *       409:
 *         description: Feature option already exists
 */
router.post('/', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { category, value } = req.body;

    const newOption = new FeatureOption({ category, value });
    await newOption.save();

    res.status(201).json(newOption);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Bu özellik zaten mevcut.' });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/feature-options:
 *   get:
 *     summary: Get all feature options grouped by category
 *     tags: [Feature Options]
 *     responses:
 *       200:
 *         description: Grouped feature options
 */
router.get('/', async (req, res, next) => {
  try {
    const allOptions = await FeatureOption.find();
    
    const groupedOptions = allOptions.reduce((acc, option) => {
      const { category, value } = option;
      if (!acc[category]) acc[category] = [];
      acc[category].push(value);
      return acc;
    }, {});

    res.json(groupedOptions);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/feature-options/findall:
 *   get:
 *     summary: Get all feature options (ungrouped)
 *     tags: [Feature Options]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all feature options
 */
router.get('/findall', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const options = await FeatureOption.find();
    res.json(options);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/feature-options/{id}:
 *   get:
 *     summary: Get feature option by ID
 *     tags: [Feature Options]
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
 *         description: Feature option details
 *       404:
 *         description: Feature option not found
 */
router.get('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const option = await FeatureOption.findById(id);
    if (!option) {
      return res.status(404).json({ message: 'Özellik bulunamadı' });
    }

    res.json(option);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/feature-options/{id}:
 *   put:
 *     summary: Update feature option
 *     tags: [Feature Options]
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
 *               category:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feature option updated successfully
 *       404:
 *         description: Feature option not found
 *       409:
 *         description: Duplicate feature option
 */
router.put('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateDto = req.body;

    const existingOption = await FeatureOption.findById(id);
    if (!existingOption) {
      return res.status(404).json({ message: 'Özellik bulunamadı' });
    }

    // Check for duplicates
    if (updateDto.category || updateDto.value) {
      const potentialDuplicate = await FeatureOption.findOne({
        category: updateDto.category || existingOption.category,
        value: updateDto.value || existingOption.value,
      });

      if (potentialDuplicate && potentialDuplicate._id.toString() !== id) {
        return res.status(409).json({ 
          message: 'Güncelleme sonucunda başka bir özellikle aynı olacak. Lütfen farklı bir değer girin.' 
        });
      }
    }

    // Update option
    Object.assign(existingOption, updateDto);
    await existingOption.save();

    res.json(existingOption);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/feature-options/{id}:
 *   delete:
 *     summary: Delete feature option
 *     tags: [Feature Options]
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
 *         description: Feature option deleted successfully
 *       404:
 *         description: Feature option not found
 */
router.delete('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await FeatureOption.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Özellik bulunamadı' });
    }

    res.json({ message: 'özellik başarı ile silindi' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;