import { ObjectId } from 'mongodb';

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User related types
export enum Role {
  Admin = 'admin',
  Member = 'member'
}

export interface User {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  image: string;
  phonenumber: number;
  password: string;
  roles: Role;
  createdAt: Date;
}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  email: string;
  name: string;
  surname: string;
  phonenumber: number;
  role: string;
  image: string;
  _id: string;
}

export interface JwtPayload {
  email: string;
  sub: string;
  roles: Role;
  iat?: number;
  exp?: number;
}

// Property related types
export interface GeoPoint {
  type: string;
  coordinates: number[];
}

export interface Location {
  city: string;
  district: string;
  neighborhood: string;
  geo: GeoPoint;
}

export interface Property {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  gross: number;
  net: number;
  numberOfRoom: string;
  buildingAge: number;
  floor: number;
  numberOfFloors: number;
  heating: string;
  numberOfBathrooms: number;
  kitchen: string;
  balcony: number;
  lift: string;
  parking: string;
  furnished: string;
  availability: string;
  dues: number;
  eligibleForLoan: string;
  titleDeedStatus: string;
  images: string[];
  location: Location;
  userId: string;
  propertyType: string;
  listingType: string;
  subType: string | null;
  selectedFeatures: { [key: string]: string[] };
  createdAt: Date;
  updatedAt: Date;
}

// Message related types
export interface Message {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  phone: number;
  message: string;
  isread: boolean;
  createdAt: Date;
}

// TrackView related types
export interface TrackView {
  _id: ObjectId;
  date: string;
  views: number;
}

// FeatureOption related types
export interface FeatureOption {
  _id: ObjectId;
  category: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

// ResetToken related types
export interface ResetToken {
  _id: ObjectId;
  tokenHash: string;
  userId: string;
  expires: Date;
  usedAt?: Date;
}

// ClientIntake related types
export interface ClientIntake {
  _id: ObjectId;
  namesurname: string;
  phone: number;
  description: string;
  createdAt: Date;
}

// File upload types
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
}

// Query types
export interface PropertyQueryParams {
  city?: string;
  district?: string;
  neighborhood?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  minNet?: number;
  maxNet?: number;
  propertyType?: string;
  listingType?: string;
  [key: string]: any;
}