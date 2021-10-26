/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { Observable } from 'rxjs';

export interface WattMeterBase {
  id?: number;
  watt: number; // watt
  time: Date;
}

export interface WattMeterExt extends WattMeterBase {
  hour: number; // Wh
  day: number; // Wh
}

export interface ElectricMeterBase {
  id?: number;
  value: number;
  time: Date;
}

export interface EventSourses {
  rormal$: Observable<ElectricMeterBase>;
  reverse$: Observable<ElectricMeterBase>;
  wattmeter$: Observable<WattMeterExt>;
}
