import { Status } from '../common/enumType';
import { BaseEntity } from '../common/base.entity';
import { Entity, Column, ManyToMany } from 'typeorm';
import { Position } from 'src/position/position.entity';

export enum UserRole {
  SUPRERADMIN = 'superadmin',
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  fullname: string;

  @Column()
  username: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerify: boolean;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_ACTIVE,
  })
  status: Status;

  @Column({ default: 0 })
  tokenVersion: number;

  @ManyToMany(() => Position, (position) => position.members)
  positions: Position[];
}
