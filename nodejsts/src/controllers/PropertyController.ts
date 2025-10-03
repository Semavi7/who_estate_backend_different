import { Request, Response } from 'express';
import { PropertyService } from '../services/PropertyService';
import { FileUploadService } from '../services/FileUploadService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { getCities, getDistrictsAndNeighbourhoodsByCityCode } from 'turkey-neighbourhoods';

export class PropertyController {
  private propertyService: PropertyService;
  private fileUploadService: FileUploadService;

  constructor() {
    this.propertyService = new PropertyService();
    this.fileUploadService = new FileUploadService();
  }

  createProperty = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ success: false, message: 'At least one image is required' });
      return;
    }

    const property = await this.propertyService.createProperty(req.body, req.files as Express.Multer.File[]);
    const response: ApiResponse = {
      success: true,
      data: property,
      message: 'Property created successfully'
    };
    res.status(201).json(response);
  });

  getAllProperties = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const properties = await this.propertyService.getAllProperties();
    const response: ApiResponse = {
      success: true,
      data: properties,
      message: 'Properties retrieved successfully'
    };
    res.status(200).json(response);
  });

  getPropertyById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const propertyId = req.params.id;
    if (!propertyId) {
      res.status(400).json({ success: false, message: 'Property ID is required' });
      return;
    }

    const property = await this.propertyService.getPropertyById(propertyId);
    const response: ApiResponse = {
      success: true,
      data: property,
      message: 'Property retrieved successfully'
    };
    res.status(200).json(response);
  });

  queryProperties = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const properties = await this.propertyService.queryProperties(req.query);
    const response: ApiResponse = {
      success: true,
      data: properties,
      message: 'Properties queried successfully'
    };
    res.status(200).json(response);
  });

  updateProperty = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const propertyId = req.params.id;
    if (!propertyId) {
      res.status(400).json({ success: false, message: 'Property ID is required' });
      return;
    }

    const newFiles = req.files as Express.Multer.File[] | undefined;
    const property = await this.propertyService.updateProperty(propertyId, req.body, newFiles);
    const response: ApiResponse = {
      success: true,
      data: property,
      message: 'Property updated successfully'
    };
    res.status(200).json(response);
  });

  deleteProperty = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const propertyId = req.params.id;
    if (!propertyId) {
      res.status(400).json({ success: false, message: 'Property ID is required' });
      return;
    }

    const result = await this.propertyService.deleteProperty(propertyId);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Property deleted successfully'
    };
    res.status(200).json(response);
  });

  findNearProperties = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { lon, lat, distance } = req.query;
    
    if (!lon || !lat || !distance) {
      res.status(400).json({ success: false, message: 'Longitude, latitude and distance are required' });
      return;
    }

    const properties = await this.propertyService.findNearProperties(
      parseFloat(lon as string),
      parseFloat(lat as string),
      parseFloat(distance as string)
    );
    const response: ApiResponse = {
      success: true,
      data: properties,
      message: 'Nearby properties retrieved successfully'
    };
    res.status(200).json(response);
  });

  getLastSixProperties = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const properties = await this.propertyService.getLastSixProperties();
    const response: ApiResponse = {
      success: true,
      data: properties,
      message: 'Last six properties retrieved successfully'
    };
    res.status(200).json(response);
  });

  getPropertyCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const count = await this.propertyService.getPropertyCount();
    const response: ApiResponse = {
      success: true,
      data: { total: count },
      message: 'Property count retrieved successfully'
    };
    res.status(200).json(response);
  });

  getCurrentYearListingStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.propertyService.getCurrentYearListingStats();
    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Current year listing stats retrieved successfully'
    };
    res.status(200).json(response);
  });

  getSubtypeAndTypePercentages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const percentages = await this.propertyService.getSubtypeAndTypePercentages();
    const response: ApiResponse = {
      success: true,
      data: percentages,
      message: 'Subtype and type percentages retrieved successfully'
    };
    res.status(200).json(response);
  });

  getCities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cities = getCities();
    const response: ApiResponse = {
      success: true,
      data: cities,
      message: 'Cities retrieved successfully'
    };
    res.status(200).json(response);
  });

  getDistrictsAndNeighbourhoods = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cityCode = req.params.id;
    if (!cityCode) {
      res.status(400).json({ success: false, message: 'City code is required' });
      return;
    }

    const districts = getDistrictsAndNeighbourhoodsByCityCode(cityCode);
    const response: ApiResponse = {
      success: true,
      data: districts,
      message: 'Districts and neighbourhoods retrieved successfully'
    };
    res.status(200).json(response);
  });

  updatePropertyUserId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const propertyId = req.params.id;
    const { userId } = req.body;
    
    if (!propertyId || !userId) {
      res.status(400).json({ success: false, message: 'Property ID and user ID are required' });
      return;
    }

    const property = await this.propertyService.updatePropertyUserId(propertyId, userId);
    const response: ApiResponse = {
      success: true,
      data: property,
      message: 'Property user ID updated successfully'
    };
    res.status(200).json(response);
  });
}