/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { EnliteGetInstance, CLASS, Device } from '@smtmt2021/enlite';
import { SmartMeterDevice } from './smart-meter-device';
import { Logger } from '../logger';
import DEBUG from 'debug';
const debug = DEBUG('logger/smartmeter');

export class SmartMeter {
  private enlite = EnliteGetInstance();

  constructor(private logger: Logger) {
    debug('smart-meter: created');
  }

  open(): Promise<boolean> {
    debug('smart-meter: open');
    this.enlite.addDeviceClass(CLASS.LOW_VOLTAGE_SMART_ELECTRIC_ENERGY_METER, SmartMeterDevice);
    const callback = async (device: Device) => {
      try {
        console.log(`logger: ${device.constructor.name} created`);
        if (device instanceof SmartMeterDevice) {
          await device.open(this.logger);
        }
      } catch (err) {
        console.error('enlite-logger: ', err);
      }
    };
    this.enlite.once('device-created', (device: Device) => callback(device));
    return this.enlite.open();
  }

  close(): Promise<void> {
    debug('smart-meter: close');
    return this.enlite.close();
  }
}
