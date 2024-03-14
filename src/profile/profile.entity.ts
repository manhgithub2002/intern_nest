import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum OldRange {
  LT18 = 'LT18',
  LT30 = 'LT30',
  LT40 = 'LT40',
  LT50 = 'LT50',
  GT50 = 'GT50',
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  phone: string;

  @Column({
    type: 'enum',
    enum: OldRange,
    default: OldRange.LT18,
  })
  role: OldRange;
}
