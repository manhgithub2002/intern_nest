import { Status } from '../common/enumType';
import { BaseEntity } from '../common/base.entity';
import { Entity, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Dept } from 'src/dept/dept.entity';

export enum Permission {
  MNG_DEPT = 'MNG_DEPT',
  MNG_POSITION = 'MNG_POSITION',
  MNG_MEMBER = 'MNG_MEMBER',
  MNG_NEWS = 'MNG_NEWS',
  MNG_COMPANY = 'MNG_COMPANY',
}

@Entity()
export class Position extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Permission,
  })
  permissions: string[];

  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column()
  numberOfUser: number;

  @ManyToMany(() => User, (user) => user.positions)
  @JoinTable()
  members: User[];

  @ManyToOne(() => Dept, (dept) => dept.position)
  dept: Dept;
}
