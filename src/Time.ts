import chalk from "chalk";
import { Serializable } from "frigid";
import { getTheme } from "@themes";

type AbbreviatedMonthName = string;

const daysInMonth = [
  31, 28, 31,
  30, 31, 30,
  31, 31, 30,
  31, 30, 31
];

const months: AbbreviatedMonthName[] = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'
]

// TODO split ticker util and calendar util...
export default class Time extends Serializable {
  targetTPS: number;
  paused = true;

  thing: Tickable;

  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;

  ticksInSecond: number;
  lastTPSCheckpoint: number;
  tps: number;

  _boundTick: Function;

  constructor(timestamp: number = 0) {
    super();
    this.minute = timestamp;
    this.normalize();
  }

  asAge() {
    if(this.year > 1) {
      return this.year + ' years old';
    } else {
      if(this.month > 2) {
        return this.month + ' months old';
      } else {
        if(this.day > 1) {
          return this.day + ' days old';
        } else if(this.day === 1) {
          return '1 day old';
        } else {
          return 'newborn';
        }
      }
    }
  }

  render() {
    const sym = (this.hour >= 6 && this.hour < 20) ?
      chalk.ansi256(226).bgAnsi256(27)(' ☼ ') :
      chalk.ansi256(254).bgAnsi256(17)(' ☾ ')

    return `${sym} ${
      getTheme().normal(`${
        this.toString()
      }`)
    }`;
  }

  toString() {
    return `${
      this.hour
    }:${
      Math.floor(this.minute).toString().padStart(2, '0')
    } ${
      months[this.month]
    } ${
      this.day + 1
    }, ${
      this.normalizedYear
    } [${
      this.tps
    } / ${
      this.targetTPS
    }]`;
  }

  ctor() {
    this.targetTPS = 60;
    this.minute ??= 0;
    this.hour ??= 0;
    this.day ??= 0;
    this.month ??= 0;
    this.year ??= 0;
    this.tps ??= 0;
    this.lastTPSCheckpoint = ms4();
    this.ticksInSecond = 0;
    this._boundTick = this.doTick.bind(this);
  }

  get second() {
    return Math.floor((this.minute % 1) * 60)
  }

  get stamp() {
    let minute = this.minute;
    let hour = this.hour;
    let day = this.day;
    let month = this.month;
    let year = this.year;

    const daysInYear = daysInMonth.reduce((a, b) => a+b, 0);

    day += daysInYear * year;
    year = 0;
    while(month > 0) {
      day += daysInMonth[month];
      month --;
    }

    hour += day * 24;
    day = 0;

    minute += hour * 60;
    hour = 0;

    return minute;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    setTimeout(this.doTick.bind(this), 0);
  }

  start(tickable: Tickable) {
    this.thing = tickable;
    this.paused = false;
    setTimeout(this.doTick.bind(this), 0);
  }
  
  advanceTime(seconds: number) {
    this.minute += seconds / 60;
    this.normalize()
  }

  get normalizedYear() {
    if(this.year >= 0) {
      return (this.year + 1).toString().padStart(4, '0') + ' CE';
    } else {
      return Math.abs(this.year).toString().padStart(4, '0') + ' BCE';
    }
  }

  normalize() {
    // while(t)
    while(this.minute >= 60) {
      this.minute -= 60;
      this.hour ++;
    }
    while(this.minute < 0) {
      this.minute += 60;
      this.hour --;
    }
    while(this.hour >= 24) {
      this.hour -= 24;
      this.day ++;
    }
    while(this.hour < 0) {
      this.hour += 24;
      this.day --;
    }

    while(this.day < 0) {
      this.day += daysInMonth[
        ((this.month % months.length) + months.length) % months.length
      ];
      this.month --;
    }
    while(this.day >= daysInMonth[this.month % months.length]) {
      this.day -= daysInMonth[this.month % months.length];
      this.month ++;
    }

    while(this.month >= 12) {
      this.month -= 12;
      this.year ++;
    }
    while(this.month < 0) {
      this.month += 12;
      this.year --;
    }
  }

  async execTick(seconds: number) {
    const doDynamicTick = true;
    
    if(doDynamicTick) {
      if(this.thing) {
        await this.thing.tick(seconds);
      }
      this.advanceTime(seconds);
    } else {
      for(let i = 0; i < seconds; i ++) {
        if(this.thing) {
          await this.thing.tick(1);
        }
        this.advanceTime(1);
      }
    }
  }

  async doTick() {

    // the higher the multitick, the more lopsided
    // ticks become in realtime, however, they rely
    // on fewer setTimeouts, which helps tick scheduling
    const multitick = 1;

    if(multitick > 1) {
      const timeout = (1000 / this.targetTPS) * multitick;
      const start = ms4();

      for(let tickNum = 0; tickNum < multitick; tickNum ++ ) {
        const seconds = 3;

        this.execTick(seconds);

        this.ticksInSecond ++;
        const end = ms4();
        
        if(end > this.lastTPSCheckpoint + 1000) {
          this.lastTPSCheckpoint = end;
          this.tps = this.ticksInSecond;
          this.ticksInSecond = 0;
        }
      }
    
      const end = ms4()
      const elapsed = end - start;
      const wait = timeout - elapsed;
      const normalizedWait = Math.floor(Math.max(wait, 0));
  
      // process.stdout.write(`tick took ${elapsed} waiting ${normalizedWait}\n`);
  
      if(wait < 0) {
        const ticksOver = (-wait / timeout) + 1;
        if(ticksOver > 1.5)
          console.log(chalk.yellow('Can\'t keep up! Tick took ' + ticksOver.toFixed(2) + ' ticks (' + (timeout - wait).toFixed(4) + 'ms)'));
      }
      
      
  
  
      if(this.paused) return;
      setTimeout(this._boundTick, normalizedWait);
    } else {
      // this code is from not needing a multi-tick workaround, due to scheduling.
      const seconds = 3;
      const timeout = 1000 / this.targetTPS;
      // const start = ms4()
      const start = ms4();
  
      this.execTick(seconds);
  
      const end = ms4()
      const elapsed = end - start;
      const wait = timeout - elapsed;
      const normalizedWait = Math.floor(Math.max(wait, 0));
  
      // process.stdout.write(`tick took ${elapsed} waiting ${normalizedWait}\n`);
  
      if(wait < 0) {
        const ticksOver = (-wait / timeout) + 1;
        if(ticksOver > 1.5)
          console.log(chalk.yellow('Can\'t keep up! Tick took ' + ticksOver.toFixed(2) + ' ticks (' + (timeout - wait).toFixed(4) + 'ms)'));
      }
      
      
      this.ticksInSecond ++;
  
      if(end > this.lastTPSCheckpoint + 1000) {
        this.lastTPSCheckpoint = end;
        this.tps = this.ticksInSecond;
        this.ticksInSecond = 0;
      }
  
      if(this.paused) return;
      setTimeout(this._boundTick, normalizedWait);
    }




    
  }
}

export interface Tickable {
  tick: (seconds: number) => Promise<void>
}

function ms4() {
  const a = process.hrtime()
  return a[0]*10e2 + a[1]/1000000;
}