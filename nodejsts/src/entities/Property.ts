import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

export class GeoPoint {
  @Column()
  type: string = 'Point';

  @Column('double', { array: true })
  coordinates: number[];
}

export class Location {
  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  neighborhood: string;

  @Column(type => GeoPoint)
  geo: GeoPoint;
}

@Entity()
export class Property {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  gross: number;

  @Column()
  net: number;

  @Column()
  numberOfRoom: string;

  @Column()
  buildingAge: number;

  @Column()
  floor: number;

  @Column()
  numberOfFloors: number;

  @Column()
  heating: string;

  @Column()
  numberOfBathrooms: number;

  @Column()
  kitchen: string;

  @Column()
  balcony: number;

  @Column()
  lift: string;

  @Column()
  parking: string;

  @Column()
  furnished: string;

  @Column()
  availability: string;

  @Column()
  dues: number;

  @Column()
  eligibleForLoan: string;

  @Column()
  titleDeedStatus: string;

  @Column('simple-array')
  images: string[];

  @Column(type => Location)
  location: Location;

  @Column()
  userId: string;

  @Column()
  propertyType: string;

  @Column()
  listingType: string;

  @Column({ nullable: true })
  subType: string | null;

  @Column()
  selectedFeatures: { [key: string]: string[] };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}