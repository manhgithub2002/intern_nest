import { Status } from '../common/enumType';
import { BaseEntity } from '../common/base.entity';
import { Entity, Column, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Position } from 'src/position/position.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/profile/profile.entity';

export enum UserRole {
  SUPRERADMIN = 'superadmin',
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @Column()
  fullname: string;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ default: false })
  isVerify: boolean;

  @ApiProperty({ enum: ['superadmin', 'admin', 'staff', 'customer'] })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_ACTIVE,
  })
  status: Status;

  @ApiProperty()
  @Column({ default: 0 })
  tokenVersion: number;

  @ApiProperty()
  @ManyToMany(() => Position, (position) => position.members)
  positions: Position[];

  @ApiProperty()
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
