const express = require('express');
const TrackView = require('../models/TrackView');

const router = express.Router();

/**
 * @swagger
 * /api/track-view:
 *   post:
 *     summary: Track a view
 *     tags: [Track View]
 *     responses:
 *       200:
 *         description: View tracked successfully
 */
router.post('/', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    let track = await TrackView.findOne({ date: today });

    if (track) {
      track.views += 1;
      await track.save();
    } else {
      track = new TrackView({
        date: today,
        views: 1
      });
      await track.save();
    }

    res.json(track);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/track-view:
 *   get:
 *     summary: Get current year view statistics
 *     tags: [Track View]
 *     responses:
 *       200:
 *         description: Monthly view statistics
 */
router.get('/', async (req, res, next) => {
  try {
    const year = new Date().getFullYear();

    const result = await TrackView.aggregate([
      {
        $match: {
          date: { $regex: `^${year}-` }
        }
      },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] },
          views: { $sum: "$views" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing months with zero
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      const found = result.find(r => r._id === `${year}-${month}`);
      return {
        month: `${year}-${month}`,
        views: found ? found.views : 0
      };
    });

    res.json(months);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/track-view/month:
 *   get:
 *     summary: Get current month total views
 *     tags: [Track View]
 *     responses:
 *       200:
 *         description: Current month total views
 */
router.get('/month', async (req, res, next) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const prefix = `${year}-${month}`;

    const result = await TrackView.aggregate([
      {
        $match: {
          date: { $regex: `^${prefix}` }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ]);

    const totalViews = result.length > 0 ? result[0].totalViews : 0;
    res.json({ totalViews });
  } catch (error) {
    next(error);
  }
});

module.exports = router;