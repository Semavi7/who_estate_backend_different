import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

@Entity()
export class Message {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone: number;

  @Column()
  message: string;

  @Column()
  isread: boolean;

  @CreateDateColumn()
  createdAt: Date;
}