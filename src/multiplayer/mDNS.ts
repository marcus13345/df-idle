import bonjour from 'bonjour';
import log from '../log.js';
import getPort from 'get-port';
import os from 'os'
import * as uuid from 'uuid';
import faker from 'faker';
import chalk from 'chalk';
import { Item } from '../Item.js';
import WebSocket from 'ws';
import { Popup } from '../ui/Popup.js';
import { inspect } from 'util'
import { Pawn } from '../Pawn.js';
import { Game } from '../Game.js';
import { Player } from './Player.js';

const mdns = bonjour();
const ID = uuid.v4();
let devices: Player[] = [];

const network = {
	get players() {
		return devices;
	}
}

export type GiftMessage = {
	pawns: string[],
	from: string
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
			const {pawns: pawnJsons, from} = JSON.parse(message);
			const pawns = [];
			for(const pawnJson of pawnJsons) {
				const pawn: Pawn = Pawn.fromJson(pawnJson);
				pawn.memories.push({
					type: "travel",
					time: {
						age: pawn.age,
						locale: Game.current.clock.toString()
					},
					location: Game.current.name
				})
				pawns.push(pawn);
			}
			new Popup(`${(() => {
				if(pawns.length === 0) return `A care package has arrived from ${from}.`;
				if(pawns.length === 1) return `A traveler from ${from} named ${pawns[0].toString()} has arrived.`;
				if(pawns.length > 1) return `A caravan of ${pawns.length} people from ${from} has arrived.`
			})()}`);
			for(const pawn of pawns) Game.current.pawns.push(pawn);
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