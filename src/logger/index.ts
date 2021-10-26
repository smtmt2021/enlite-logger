/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { Subject } from 'rxjs';
import { Connection, createConnection, Repository } from 'typeorm';
import { Constant } from '../entity/counter-constant';
import { WattMeter } from '../entity/watt-meter';
import { NormalCounter } from '../entity/normal-counter';
import { ReverseCounter } from '../entity/reverse-counter';
import { WattMeterExt, ElectricMeterBase } from '../interfaces';
import { OneDayFilter } from '../libs/one-day-filter';
import DEBUG from 'debug';
const debug = DEBUG('logger/logger');

export class Logger {
  private connection?: Connection;
  private constant?: Repository<Constant>;
  private normal?: Repository<NormalCounter>;
  private reverse?: Repository<ReverseCounter>;
  private wattmeter?: Repository<WattMeter>;
  private lastConstant?: Constant;
  private filter = new OneDayFilter();

  normal$ = new Subject<ElectricMeterBase>();
  reverse$ = new Subject<ElectricMeterBase>();
  wattmeter$ = new Subject<WattMeterExt>();

  constructor(private nodb = false) {
    debug('smartmeter-logger: created');
  }

  async open(): Promise<void> {
    if (this.nodb) {
      debug('smartmeter-logger: open with no-databse mode');
      return;
    }
    debug('smartmeter-logger: open');
    this.connection = await createConnection();
    this.constant = this.connection.getRepository(Constant);
    this.normal = this.connection.getRepository(NormalCounter);
    this.reverse = this.connection.getRepository(ReverseCounter);
    this.wattmeter = this.connection.getRepository(WattMeter);
    this.lastConstant
      = await this.constant?.find({ order: { id: 'DESC' }, take: 1 }).then(r => r[0]);

    await this.normal?.find({ order: { id: 'DESC' }, take: 1 }).then(results => {
      if (results.length) {
        this.normal$.next(results[0]);
      }
    });
    await this.reverse?.find({ order: { id: 'DESC' }, take: 1 }).then(results => {
      if (results.length) {
        this.reverse$.next(results[0]);
      }
    });
    await this.wattmeter?.find({ order: { id: 'DESC' }, take: 1 }).then(results => {
      if (results.length) {
        this.wattmeter$.next(Object.assign({
          hour: this.filter.hour,
          day: this.filter.day
        }, results[0]));
      }
    });
  }

  async close(): Promise<void> {
    debug('logger: close');
    await this.connection?.close();
    this.connection = this.constant = this.normal = this.reverse = this.wattmeter = undefined;
  }

  async saveNormal(value: number, time: Date): Promise<void> {
    debug('logger: save-normal', value, time);
    if (this.lastConstant) {
      const entity = new NormalCounter(value, time, this.lastConstant);
      await this.normal?.save(entity);
      this.normal$.next(entity);
    }
  }

  async saveReverse(value: number, time: Date): Promise<void> {
    debug('logger: save-reverse', value, time);
    if (this.lastConstant) {
      const entity = new NormalCounter(value, time, this.lastConstant);
      await this.reverse?.save(entity);
      this.reverse$.next(entity);
    }
  }

  async saveWatt(value: number, time: Date): Promise<void> {
    debug('logger: save-watt', value);
    const entity = new WattMeter(value, time);
    await this.wattmeter?.save(entity);
    this.filter.push(entity);
    this.wattmeter$.next(Object.assign({
      hour: this.filter.hour,
      day: this.filter.day
    }, entity));
  }

  async saveConstant(coefficient: number, digits: number, unit: number): Promise<void> {
    debug('logger: save-constant', coefficient, digits, unit);
    const entity = new Constant(coefficient, digits, unit);
    await this.constant?.save(entity);
    this.lastConstant = entity;
  }
}
