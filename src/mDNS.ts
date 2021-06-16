import bonjour from 'bonjour';
import log from './log.js';
import getPort from 'get-port';
import os from 'os'
import * as uuid from 'uuid';
import faker from 'faker';
import chalk from 'chalk';
import { Item, ItemState } from './Item.js';
import WebSocket from 'ws';
import { Popup } from './Popup.js';
import { inspect } from 'util'

const mdns = bonjour();
const ID = uuid.v4();
let devices: Player[] = [];

class Player {
	name: string;
	host: string;
	port: number;

	toString() {
		return `  ${this.name} ${chalk.bold.black(`${this.host}:${this.port}`)}`;
	}

	sendItem(item: ItemState) {
		return new Promise((res, rej) => {
			const log = new ItemState(Item.LOG, 1, {});
			const json = log.toJson();
			const socket = new WebSocket(`ws://${this.host}:${this.port}`);
			// new Popup(`opening ws://${this.host}:${this.port}`);
			socket.on('open', () => {
				socket.send(json);
				socket.close();
				res(undefined);
			});
			socket.on('error', () => {
				rej(log);
			});
		});
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
	const wss = new WebSocket.Server({ port });
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			new Popup(inspect(message));
		});
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