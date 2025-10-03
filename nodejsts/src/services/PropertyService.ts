import { PropertyRepository } from '../repositories/PropertyRepository';
import { UserService } from './UserService';
import { FileUploadService } from './FileUploadService';
import { Property, GeoPoint, Location } from '../types';
import { AppError } from '../middleware/errorHandler';

export class PropertyService {
  private propertyRepository: PropertyRepository;
  private userService: UserService;
  private fileUploadService: FileUploadService;

  constructor() {
    this.propertyRepository = new PropertyRepository();
    this.userService = new UserService();
    this.fileUploadService = new FileUploadService();
  }

  async initialize(): Promise<void> {
    await this.propertyRepository.createCollectionIndex();
  }

  async createProperty(propertyData: any, imageFiles: Express.Multer.File[]): Promise<Property> {
    // Upload images
    const imageUrls = await Promise.all(
      imageFiles.map(file => this.fileUploadService.uploadFile(file, true))
    );

    // Parse location data
    const locationData = JSON.parse(propertyData.location);
    const selectedFeaturesData = propertyData.selectedFeatures ? JSON.parse(propertyData.selectedFeatures) : {};

    // Create geo point
    const geoPoint: GeoPoint = {
      type: 'Point',
      coordinates: locationData.geo.coordinates.map((coord: string) => parseFloat(coord))
    };

    // Create location
    const location: Location = {
      city: locationData.city,
      district: locationData.district,
      neighborhood: locationData.neighborhood,
      geo: geoPoint
    };

    // Create property
    const property = await this.propertyRepository.create({
      title: propertyData.title,
      description: propertyData.description,
      price: propertyData.price,
      gross: propertyData.gross,
      net: propertyData.net,
      numberOfRoom: propertyData.numberOfRoom,
      buildingAge: propertyData.buildingAge,
      floor: propertyData.floor,
      numberOfFloors: propertyData.numberOfFloors,
      heating: propertyData.heating,
      numberOfBathrooms: propertyData.numberOfBathrooms,
      kitchen: propertyData.kitchen,
      balcony: propertyData.balcony,
      lift: propertyData.lift,
      parking: propertyData.parking,
      furnished: propertyData.furnished,
      availability: propertyData.availability,
      dues: propertyData.dues,
      eligibleForLoan: propertyData.eligibleForLoan,
      titleDeedStatus: propertyData.titleDeedStatus,
      images: imageUrls,
      location: location,
      propertyType: propertyData.propertyType,
      listingType: propertyData.listingType,
      subType: propertyData.subType,
      selectedFeatures: selectedFeaturesData,
      userId: propertyData.userId
    });

    return await this.enrichPropertyWithUser(property);
  }

  async getAllProperties(): Promise<Property[]> {
    const properties = await this.propertyRepository.findAll();
    return await Promise.all(properties.map(property => this.enrichPropertyWithUser(property)));
  }

  async getPropertyById(id: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new AppError('Property not found', 404);
    }
    return await this.enrichPropertyWithUser(property);
  }

  async queryProperties(queryParams: any): Promise<Property[]> {
    const properties = await this.propertyRepository.queryProperties(queryParams);
    return await Promise.all(properties.map(property => this.enrichPropertyWithUser(property)));
  }

  async updateProperty(id: string, propertyData: any, newFiles?: Express.Multer.File[]): Promise<Property> {
    const existingProperty = await this.propertyRepository.findById(id);
    if (!existingProperty) {
      throw new AppError('Property not found', 404);
    }

    // Handle image updates
    const keptImageUrls = propertyData.existingImageUrls ? JSON.parse(propertyData.existingImageUrls) : [];
    const newImageUrls = newFiles ? await Promise.all(newFiles.map(file => this.fileUploadService.uploadFile(file, true))) : [];
    const finalImageUrls = [...keptImageUrls, ...newImageUrls];

    // Update property data
    const updateData: any = { images: finalImageUrls };

    for (const key in propertyData) {
      if (key !== 'existingImageUrls' && propertyData[key] !== undefined) {
        if (['location', 'selectedFeatures'].includes(key)) {
          updateData[key] = JSON.parse(propertyData[key]);
        } else {
          updateData[key] = propertyData[key];
        }
      }
    }

    const updatedProperty = await this.propertyRepository.update(id, updateData);
    if (!updatedProperty) {
      throw new AppError('Property not found', 404);
    }

    return await this.enrichPropertyWithUser(updatedProperty);
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    const deleted = await this.propertyRepository.delete(id);
    if (!deleted) {
      throw new AppError('Property not found', 404);
    }
    return { message: 'Property deleted successfully' };
  }

  async findNearProperties(lon: number, lat: number, distance: number): Promise<Property[]> {
    const properties = await this.propertyRepository.findNear(lon, lat, distance);
    return await Promise.all(properties.map(property => this.enrichPropertyWithUser(property)));
  }

  async getLastSixProperties(): Promise<Property[]> {
    const properties = await this.propertyRepository.findLastSix();
    return await Promise.all(properties.map(property => this.enrichPropertyWithUser(property)));
  }

  async getCurrentYearListingStats(): Promise<{ month: string; count: number }[]> {
    return await this.propertyRepository.getCurrentYearListingStats();
  }

  async getPropertyCount(): Promise<number> {
    return await this.propertyRepository.count();
  }

  async getSubtypeAndTypePercentages(): Promise<any> {
    return await this.propertyRepository.getSubtypeAndTypePercentages();
  }

  async updatePropertyUserId(id: string, userId: string): Promise<Property> {
    const updatedProperty = await this.propertyRepository.update(id, { userId });
    if (!updatedProperty) {
      throw new AppError('Property not found', 404);
    }
    return await this.enrichPropertyWithUser(updatedProperty);
  }

  private async enrichPropertyWithUser(property: Property): Promise<Property> {
    if (property.userId) {
      try {
        const user = await this.userService.findUserById(property.userId);
        (property as any).user = user;
      } catch (error) {
        (property as any).user = null;
        console.warn(`User not found: ${property.userId} for property ID: ${property._id}`);
      }
    }
    return property;
  }
}