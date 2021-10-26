/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { SmartElectricEnergyMeter } from '@smtmt2021/enlite';
import { Logger } from '../logger';
import DEBUG from 'debug';
const debug = DEBUG('logger/smartmeter');

const INTERVAL = 60 * 1000;

export class SmartMeterDevice extends SmartElectricEnergyMeter {
  private timer?: NodeJS.Timeout;
  private logger?: Logger;

  open(): Promise<boolean>;
  open(logger: Logger): Promise<boolean>;
  async open(logger?: Logger): Promise<boolean> {
    debug('smartmeter-device: open');
    if (!logger) {
      return false;
    }
    if (!await super.open()) {
      return false;
    }
    const coefficient = await this.getCoefficient();
    const digits = await this.getEffectiveDigits();
    const unit = await this.getUnit();
    if (!coefficient || !digits || !unit) {
      return false;
    }
    this.logger = logger;
    await this.logger.saveConstant(coefficient, digits, unit);
    this.on('cumulative-amounts-of-energy-normal', (time: Date, value: number) => this.onNormal(time, value));
    this.on('cumulative-amounts-of-energy-reverse', (time: Date, value: number) => this.onReverse(time, value));
    this.startPolling();
    return true;
  }

  close(): Promise<boolean> {
    debug('smartmeter-device: close');
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    return super.close();
  }

  private startPolling() {
    const callback = async () => {
      try {
        const time = new Date();
        const watt = await this.getInstantaneousElectricEnergey();
        if (!watt) {
          console.info('smartmeter-logger: failed to retrieve a current value');
          return;
        }
        await this.logger?.saveWatt(watt, time);
      } catch (err) {
        console.error('smartmeter-logger: ', err);
      }
    };
    this.timer = setInterval(callback, INTERVAL);
  }

  private onNormal(time: Date, value: number) {
    this.logger?.saveNormal(value, time);
  }

  private onReverse(time: Date, value: number) {
    this.logger?.saveReverse(value, time);
  }
}
