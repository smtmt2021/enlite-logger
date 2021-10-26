/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Logger } from './logger';
import { SmartMeter } from './smart-meter';
import { ElectricMeterBase, WattMeterExt, EventSourses } from './interfaces';
import DEBUG from 'debug';
const debug = DEBUG('logger/smartmeterlogger');

export { getManager as getEntityManager, getRepository } from 'typeorm';
export { WattMeterExt, ElectricMeterBase, EventSourses } from './interfaces';
export { WattMeter } from './entity/watt-meter';
export { NormalCounter } from './entity/normal-counter';
export { ReverseCounter } from './entity/reverse-counter';

export class SmartmeterLogger implements EventSourses {
  private logger: Logger;
  private smartmeter: SmartMeter;

  get rormal$(): Observable<ElectricMeterBase> {
    return this.logger.normal$.pipe(shareReplay(1));
  }

  get reverse$(): Observable<ElectricMeterBase> {
    return this.logger.reverse$.pipe(shareReplay(1));
  }

  get wattmeter$(): Observable<WattMeterExt> {
    return this.logger.wattmeter$.pipe(shareReplay(1));
  }

  constructor() {
    debug('smartmeter-logger: created');
    const nodb = !!process.env.SMARTMETER_NO_DB;
    this.logger = new Logger(nodb);
    this.smartmeter = new SmartMeter(this.logger);
  }

  async open(): Promise<void> {
    console.log('smartmeter-logger: open');
    await this.logger.open();
    await this.smartmeter.open();
  }

  async close(): Promise<void> {
    console.log('smartmeter-logger: close');
    await this.smartmeter.close();
    await this.logger.close();
  }
}
