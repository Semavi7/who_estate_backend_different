import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

@Entity()
export class ResetToken {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;

  @Index({ unique: true })
  @Column()
  tokenHash: string;

  @Column()
  userId: string;

  @Column()
  expires: Date;

  @Column({ nullable: true })
  usedAt?: Date;
}