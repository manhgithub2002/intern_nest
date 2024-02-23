import { Status } from '../common/enumType';
import { BaseEntity } from '../common/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Company } from 'src/company/company.entity';
import { Position } from 'src/position/position.entity';

export enum Type {
  DEPT_1 = 'DEPT_1',
  DEPT_2 = 'DEPT_2',
  DEPT_3 = 'DEPT_3',
}

@Entity()
export class Dept extends BaseEntity {
  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Type,
  })
  type: Type;

  @Column()
  numberOfUser: number;

  @Column({ default: false })
  isVerify: boolean;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_ACTIVE,
  })
  status: Status;

  @ManyToOne(() => Company, (company) => company.dept)
  company: Company;

  @OneToMany(() => Position, (position) => position.dept)
  position: Position;
}
