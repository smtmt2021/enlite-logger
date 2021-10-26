/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { WattMeterBase } from '../interfaces';

const ONE_SECOUND = 1000;
const ONE_MINUTE = 60 * ONE_SECOUND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

function diff(w1: WattMeterBase, w2: WattMeterBase) {
  return w1.time.getTime() - w2.time.getTime();
}

function isOneDayBefore(w1: WattMeterBase, w2: WattMeterBase) {
  return diff(w1, w2) >= ONE_DAY;
}

function isOneHourBefore(w1: WattMeterBase, w2: WattMeterBase) {
  return diff(w1, w2) >= ONE_HOUR;
}

function calcWh(fifo: WattMeterBase[]) {
  let wh = 0;
  if (fifo.length > 1) {
    let predecessor = fifo[0];
    fifo.slice(1).forEach(w => {
      wh += predecessor.watt * diff(w, predecessor) / ONE_HOUR;
      predecessor = w;
    });
    wh += predecessor.watt * ONE_MINUTE / ONE_HOUR;
  }
  return wh;
}

export class OneDayFilter {
  private fifo: WattMeterBase[] = [];

  get hour(): number {
    if (this.fifo.length < 2) {
      return 0;
    }
    const latest = this.fifo[this.fifo.length - 1];
    const index = this.fifo.findIndex(v => !isOneHourBefore(latest, v));
    return index >= 0 ? calcWh(this.fifo.slice(index)) : 0;
  }

  get day(): number {
    return calcWh(this.fifo);
  }

  push(latest: WattMeterBase): void {
    const index = this.fifo.findIndex(v => !isOneDayBefore(latest, v));
    if (index >= 0) {
      this.fifo = this.fifo.slice(index);
    }
    this.fifo.push(latest);
  }
}
