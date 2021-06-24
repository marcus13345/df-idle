// TODO pull in full test framework and coverage shit from vogue
import { expect } from 'chai';
import Time from './Time.js';

describe('Time', () => {
  describe('normalize timestamps correctly', () => {
    it('0', () => {
      const time = new Time(0);
      expect(time.toString()).to.equal("0:00 Jan 1, 0001 CE");
    })
    it('-1', () => {
      const time = new Time(-1);
      expect(time.toString()).to.equal("23:59 Dec 31, 0001 BCE");
    })
    it('1', () => {
      const time = new Time(1);
      expect(time.toString()).to.equal("0:01 Jan 1, 0001 CE");
      expect(time)
    })
    it('0.25', () => {
      const time = new Time(0.25);
      expect(time.toString()).to.equal("0:00 Jan 1, 0001 CE");
      expect(time.second).to.equal(15);
    })
    it('-0.25', () => {
      const time = new Time(-0.25);
      expect(time.toString()).to.equal("23:59 Dec 31, 0001 BCE");
      expect(time.second).to.equal(45);
    })
  })
});