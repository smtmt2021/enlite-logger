/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { WattMeterBase } from '../interfaces';
import DEBUG from 'debug';
const debug = DEBUG('logger/wattmeter');

@Entity()
export class WattMeter implements WattMeterBase {
  constructor(value: number, time: Date) {
    debug('wattmeter:', value);
    this.watt = value;
    this.time = time;
  }

  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column()
  readonly watt: number;

  @Column('datetime')
  readonly time: Date;

  @CreateDateColumn()
  readonly createdAt?: Date;
}
