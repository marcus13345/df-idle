import bonjour from 'bonjour';
import log from './log.js';
import getPort from 'get-port';
import os from 'os'
import * as uuid from 'uuid';
import faker from 'faker';

const mdns = bonjour();
const ID = uuid.v4();
let devices = [];

class Player {
	name: string;
	host: string;
	port: number;

	toString() {
		return `  ${this.name}`;
	}
}

const network = {
	get players() {
		return devices;
	}
}

export default network;

export async function ready(name, onThing?) {
	const port = await getPort({port: getPort.makeRange(52300, 52399)});
	mdns.publish({
		type: 'dfi',
		name,
		port: port
	});
}

mdns.find({
	type: 'dfi'
}, (service) => {
	const p = new Player();
	p.name = service.name;
	p.host = service.host;
	p.port = service.port;
	log.info('Found player', p);
	devices.push(p);
});