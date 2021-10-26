/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import DEBUG from 'debug';
const debug = DEBUG('logger/constant');

function unitkWh(unit: number) {
  switch (unit) {
    case 0: return 1;
    case 1: return 0.1;
    case 2: return 0.01;
    case 3: return 0.001;
    case 4: return 0.0001;
    case 10: return 10;
    case 11: return 100;
    case 12: return 1000;
    case 13: return 10000;
    default: return 0;
  }
}

@Entity()
export class Constant {
  constructor(
    coefficient: number,
    digits: number,
    unit: number
  ) {
    debug('Constant', coefficient, digits, unit);
    this.coefficient = coefficient;
    this.digits = digits;
    this.unit = unit;
  }

  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column()
  readonly coefficient: number;

  @Column()
  readonly digits: number;

  @Column()
  readonly unit: number;

  @CreateDateColumn()
  readonly createdAt?: Date;

  get unitkWh(): number {
    return unitkWh(this.unit);
  }

  get digitsLimitter(): number {
    return Math.pow(10, this.digits);
  }
}
