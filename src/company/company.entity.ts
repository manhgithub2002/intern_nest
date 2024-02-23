import { Status } from '../common/enumType';
import { BaseEntity } from '../common/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Dept } from 'src/dept/dept.entity';

export enum MemberSize {
  LT_50 = 'LT_50',
  LT_100 = 'LT_100',
  Gt_100 = 'GT_100',
}

export enum Category {
  COMPANY = '0',
  ORGANIZATION = '1',
}

@Entity()
export class Company extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Category,
  })
  type: Category;

  @Column({
    type: 'enum',
    enum: MemberSize,
  })
  memberSize: MemberSize;

  @Column()
  website: string;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;

  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column()
  numberOfUser: number;

  @OneToMany(() => Dept, (dept) => dept.company)
  dept: Dept;
}
