import chalk from "chalk";
import { Serializable } from "frigid";
import { getTheme } from "./ui/Theme.js";
import { Renderable } from "./ui/UI.js";

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

export default class Time extends Serializable implements Renderable {
  rate: number;
  paused = true;

  thing: Tickable;

  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;

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
      chalk.ansi256(226).bgAnsi256(27)(' ☀ ') :
      chalk.ansi256(254).bgAnsi256(17)(' ☾ ')

    return `${sym} ${
      getTheme().normal(`${
        this.hour.toString().padStart(2, ' ')
      }:${
        this.minute.toString().padStart(2, '0')
      } ${
        months[this.month]
      } ${
        this.day + 1
      }, ${
        this.normalizedYear
      }`)
    }`;

    // return '☾' || '☼';
  }

  toString() {
    return `${this.hour}:${this.minute.toString().padStart(2, '0')} ${months[this.month]} ${this.day + 1}, ${this.normalizedYear}`
  }

  ctor() {
    this.rate = 60;
    this.minute ??= 0;
    this.hour ??= 0;
    this.day ??= 0;
    this.month ??= 0;
    this.year ??= 0;
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

  start() {
    this.paused = false;
    setTimeout(this.doTick.bind(this), 0);
  }
  
  advanceTime(minutes) {
    this.minute ++;
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

  async doTick() {
    this.advanceTime(1);
    const timeout = 1000 / this.rate;
    const start = new Date().getTime();
    if(this.thing) {
      await this.thing.tick();
    }
    const elapsed = new Date().getTime() - start;
    const wait = Math.max(timeout - elapsed, 0);
    if(this.paused) return;
    setTimeout(this.doTick.bind(this), wait)
  }
}


export interface Tickable {
  tick: () => Promise<void>
}