
const express = require('express');
const multer = require('multer');
const Property = require('../models/Property');
const User = require('../models/User');
const { authorizeRoles } = require('../middleware/auth');
const { validateCreateProperty } = require('../middleware/validation');
const { uploadPropertyImages } = require('../services/fileUpload');
const { getCities, getDistrictsAndNeighbourhoodsByCityCode } = require('turkey-neighbourhoods');
const categoryStructure = require('../config/category-structure');

const router = express.Router();

// Configure multer for multiple file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 20 // Maximum 20 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - gross
 *               - net
 *               - propertyType
 *               - listingType
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               gross:
 *                 type: number
 *               net:
 *                 type: number
 *               propertyType:
 *                 type: string
 *               listingType:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', authorizeRoles('admin', 'member'), upload.array('images', 20), validateCreateProperty, async (req, res, next) => {
  try {
    const createDto = req.body;
    const files = req.files || [];

    // Parse location and selectedFeatures
    const locationData = JSON.parse(createDto.location);
    const selectedFeaturesData = createDto.selectedFeatures ? JSON.parse(createDto.selectedFeatures) : {};

    // Upload images
    const imageUrls = await uploadPropertyImages(files, true);

    // Create property
    const newProperty = new Property({
      title: createDto.title,
      description: createDto.description,
      price: createDto.price,
      gross: createDto.gross,
      net: createDto.net,
      numberOfRoom: createDto.numberOfRoom,
      buildingAge: createDto.buildingAge,
      floor: createDto.floor,
      numberOfFloors: createDto.numberOfFloors,
      heating: createDto.heating,
      numberOfBathrooms: createDto.numberOfBathrooms,
      kitchen: createDto.kitchen,
      balcony: createDto.balcony,
      lift: createDto.lift,
      parking: createDto.parking,
      furnished: createDto.furnished,
      availability: createDto.availability,
      dues: createDto.dues,
      eligibleForLoan: createDto.eligibleForLoan,
      titleDeedStatus: createDto.titleDeedStatus,
      images: imageUrls,
      location: locationData,
      propertyType: createDto.propertyType,
      listingType: createDto.listingType,
      subType: createDto.subType,
      selectedFeatures: selectedFeaturesData,
      userId: createDto.userId
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get('/', async (req, res, next) => {
  try {
    const properties = await Property.find();
    
    // Populate user data for each property
    const propertiesWithUsers = await Promise.all(
      properties.map(async (property) => {
        if (property.userId) {
          try {
            const user = await User.findById(property.userId);
            return { ...property.toObject(), user };
          } catch (error) {
            console.warn(`Kullanıcı bulunamadı: ${property.userId} için ilan ID: ${property._id}`);
            return { ...property.toObject(), user: null };
          }
        }
        return property.toObject();
      })
    );

    res.json(propertiesWithUsers);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/query:
 *   get:
 *     summary: Query properties with filters
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: neighborhood
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Filtered properties
 */
router.get('/query', async (req, res, next) => {
  try {
    const queryParams = req.query;
    const where = {};

    const numericFields = ['price', 'gross', 'net', 'buildingAge', 'floor', 'numberOfFloors', 'numberOfBathrooms', 'dues'];

    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const value = queryParams[key];
        
        if (key === 'city' || key === 'district' || key === 'neighborhood') {
          where[`location.${key}`] = value;
        } else if (numericFields.includes(key)) {
          where[key] = parseInt(value, 10);
        } else if (key === 'minNet' || key === 'minPrice') {
          const field = key.substring(3).toLowerCase();
          where[field] = { $gte: parseInt(value, 10) };
        } else if (key === 'maxNet' || key === 'maxPrice') {
          const field = key.substring(3).toLowerCase();
          where[field] = { ...where[field], $lte: parseInt(value, 10) };
        } else {
          where[key] = value;
        }
      }
    }

    const properties = await Property.find(where);
    res.json(properties);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/near:
 *   get:
 *     summary: Find properties near coordinates
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: distance
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Nearby properties
 */
router.get('/near', async (req, res, next) => {
  try {
    const { lon, lat, distance } = req.query;

    const properties = await Property.find({
      'location.geo': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          $maxDistance: parseFloat(distance)
        }
      }
    });

    res.json(properties);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/lastsix:
 *   get:
 *     summary: Get last six properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Last six properties
 */
router.get('/lastsix', async (req, res, next) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(6);

    const propertiesWithUsers = await Promise.all(
      properties.map(async (property) => {
        if (property.userId) {
          try {
            const user = await User.findById(property.userId);
            return { ...property.toObject(), user };
          } catch (error) {
            console.warn(`Kullanıcı bulunamadı: ${property.userId} için ilan ID: ${property._id}`);
            return { ...property.toObject(), user: null };
          }
        }
        return property.toObject();
      })
    );

    res.json(propertiesWithUsers);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/count:
 *   get:
 *     summary: Get total property count
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Total property count
 */
router.get('/count', async (req, res, next) => {
  try {
    const total = await Property.countDocuments();
    res.json({ total });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/yearlistings:
 *   get:
 *     summary: Get current year listing statistics
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Monthly listing statistics
 */
router.get('/yearlistings', async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    
    const result = await Property.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
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
        count: found ? found.count : 0
      };
    });

    res.json(months);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/piechart:
 *   get:
 *     summary: Get property type percentages for pie chart
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Property type percentages
 */
router.get('/piechart', async (req, res, next) => {
  try {
    const total = await Property.countDocuments();

    if (total === 0) {
      return res.json({ message: 'Database boş.' });
    }

    const daireCount = await Property.countDocuments({ subType: { $regex: "^Daire$", $options: "i" } });
    const villaCount = await Property.countDocuments({ subType: { $regex: "^Villa$", $options: "i" } });
    const dukkanCount = await Property.countDocuments({ subType: { $regex: "^Dükkan$", $options: "i" } });
    const arsaCount = await Property.countDocuments({ propertyType: { $regex: "^Arsa$", $options: "i" } });

    const data = [
      {
        name: "Daire",
        value: (daireCount / total) * 100,
        color: "#0088FE"
      },
      {
        name: "Villa",
        value: (villaCount / total) * 100,
        color: "#00C49F"
      },
      {
        name: "Dükkan",
        value: (dukkanCount / total) * 100,
        color: "#FFBB28"
      },
      {
        name: "Arsa",
        value: (arsaCount / total) * 100,
        color: "#FF8042"
      }
    ];

    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/categories:
 *   get:
 *     summary: Get category structure
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Category structure
 */
router.get('/categories', async (req, res, next) => {
  try {
    res.json(categoryStructure);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/adress:
 *   get:
 *     summary: Get all cities
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of cities
 */
router.get('/adress', async (req, res, next) => {
  try {
    const cities = getCities();
    res.json(cities);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/adress/{id}:
 *   get:
 *     summary: Get districts and neighborhoods by city code
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Districts and neighborhoods
 */
router.get('/adress/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = getDistrictsAndNeighbourhoodsByCityCode(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'İlan Bulunamadı' });
    }

    if (property.userId) {
      try {
        const user = await User.findById(property.userId);
        const propertyWithUser = { ...property.toObject(), user };
        res.json(propertyWithUser);
      } catch (error) {
        console.warn(`Kullanıcı bulunamadı: ${property.userId} için ilan ID: ${property._id}`);
        res.json(property);
      }
    } else {
      res.json(property);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update property
 *     tags: [Properties]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
router.put('/:id', authorizeRoles('admin', 'member'), upload.array('newImages', 20), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateDto = req.body;
    const newFiles = req.files || [];

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ message: 'Bu ıd ye ait kayıt bulunamadı' });
    }

    // Handle image updates
    const keptImageUrls = updateDto.existingImageUrls ? JSON.parse(updateDto.existingImageUrls) : [];
    const newImageUrls = newFiles.length > 0 ? await uploadPropertyImages(newFiles, true) : [];
    const finalImageUrls = [...keptImageUrls, ...newImageUrls];
    existingProperty.images = finalImageUrls;

    // Update other fields
    for (const key in updateDto) {
      if (key !== 'existingImageUrls' && updateDto[key] !== undefined) {
        if (['location', 'selectedFeatures'].includes(key)) {
          existingProperty[key] = JSON.parse(updateDto[key]);
        } else {
          existingProperty[key] = updateDto[key];
        }
      }
    }

    await existingProperty.save();
    res.json(existingProperty);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete property
 *     tags: [Properties]
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
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
router.delete('/:id', authorizeRoles('admin', 'member'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await Property.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Böyle bir Id bulunamadı' });
    }

    res.json({ message: 'İlan başarı ile silindi' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   patch:
 *     summary: Update property user ID
 *     tags: [Properties]
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
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User ID updated successfully
 *       404:
 *         description: Property not found
 */
router.patch('/:id', authorizeRoles('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ message: 'Bu ıd ye ait kayıt bulunamadı' });
    }

    existingProperty.userId = userId;
    await existingProperty.save();

    res.json(existingProperty);
  } catch (error) {
    next(error);
  }
});

module.exports = router;