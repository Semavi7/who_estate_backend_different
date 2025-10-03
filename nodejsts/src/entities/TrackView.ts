import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

@Entity()
export class TrackView {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;

  @Column()
  date: string;

  @Column()
  views: number;
}