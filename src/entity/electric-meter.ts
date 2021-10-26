/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Constant } from './counter-constant';
import { ElectricMeterBase } from '../interfaces';
import DEBUG from 'debug';
const debug = DEBUG('logger/counter');

export abstract class ElectricMeter implements ElectricMeterBase {
  constructor(value: number, time: Date, constant: Constant) {
    debug(this.constructor.name, value, time, constant);
    this.value = value;
    this.time = time;
    this.constantId = constant.id ?? 0;
  }

  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column('int')
  readonly value: number;

  @Column('datetime')
  readonly time: Date;

  @Column('int')
  readonly constantId: number;

  @CreateDateColumn()
  readonly createdAt?: Date;
}
