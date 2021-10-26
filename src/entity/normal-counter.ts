/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { Entity } from 'typeorm';
import { ElectricMeter } from './electric-meter';

@Entity()
export class NormalCounter extends ElectricMeter {
}
