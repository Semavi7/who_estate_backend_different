import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

@Entity()
export class ClientIntake {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;

  @Column()
  namesurname: string;

  @Column()
  phone: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}