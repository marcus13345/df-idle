import { ItemState } from '../registries/Items.js';
import WebSocket from 'ws';
import { Pawn } from '../Pawn.js';
import { Game } from '../Game.js';
import { GiftMessage } from './mDNS';


export class Player {
	name: string;
	host: string;
	port: number;

	toString() {
		return this.name;
	}

	send(items: (ItemState | Pawn)[]) {
		return new Promise((res, rej) => {
			const pawnJsons: string[] = [];
			for (const item of items) {
				Game.current.removePawn(item as Pawn);
				pawnJsons.push(item.toJson());
			}
			const gift: GiftMessage = {
				pawns: pawnJsons,
				from: Game.current.name
			};
			const socket = new WebSocket(`ws://${this.host}:${this.port}`);
			socket.on('open', () => {
				socket.send(JSON.stringify(gift));
				socket.close();
				res(undefined);
			});
			socket.on('error', () => {
				rej(items);
			});
		});
	}
}
