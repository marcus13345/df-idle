
import bonjour from 'bonjour';
import log from './log.js';
import os from 'os'
import * as uuid from 'uuid';
const mdns = bonjour();
const ID = uuid.v4();
let devices = [];

type Player = {
	name: string,
	address: string,
	port: number
}

const network = {
	get players() {
		return devices;
	}
}

export default network;

export function ready() {
	mdns.publish({
		type: 'dfi',
		name: os.hostname() + '-' + ID,
		port: 6969
	});
}

mdns.find({
	type: 'dfi'
}, (service) => {
	log.info('found network device', service);
});