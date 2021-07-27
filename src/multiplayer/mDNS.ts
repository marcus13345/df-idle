import bonjour from 'bonjour';
import getPort from 'get-port';
import os from 'os'
import * as uuid from 'uuid';
import faker from 'faker';
import chalk from 'chalk';
import { Item } from '../registries/Items.js';
import WebSocket, { EventEmitter } from 'ws';
import { Popup } from '@ui';
import { inspect } from 'util'
import { Pawn } from '../Pawn.js';
import { Game } from '../Game.js';
import { Player } from './Player.js';
import { injectTravelMemory } from '../Memories.js';
import { MDNS_TYPE } from '../Constants.js';

const mdns = bonjour();
const ID = uuid.v4();
let devices: Player[] = [];

const network = new (class Network extends EventEmitter {
  get players() {
    return devices;
  }
})();

export type GiftMessage = {
  pawns: string[],
  from: string
}

export default network;

export async function ready(name: string) {
  const port = await getPort({port: getPort.makeRange(52300, 52399)});
  mdns.publish({
    type: MDNS_TYPE,
    name,
    port: port
  });
  const wss = new WebSocket.Server({ port });
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      const {pawns: pawnJsons, from} = JSON.parse(message.toString());
      const pawns = [];
      for(const pawnJson of pawnJsons) {
        const pawn: Pawn = Pawn.fromJson(pawnJson);
        pawns.push(pawn);
        injectTravelMemory(pawn);
      }
      Popup.show(`${(() => {
        if(pawns.length === 0) return `A care package has arrived from ${from}.`;
        if(pawns.length === 1) return `A traveler from ${from} named ${pawns[0].toString()} has arrived.`;
        if(pawns.length > 1) return `A caravan of ${pawns.length} people from ${from} has arrived.`
      })()}`);
      for(const pawn of pawns) Game.current.pawns.push(pawn);
    });
  });
}

mdns.find({
  type: MDNS_TYPE
}, (service) => {
  network.emit('change');
  const p = new Player();
  p.name = service.name;
  p.host = service.host;
  p.port = service.port;
  devices.push(p);
}).on("down", (service) => {
  network.emit('change');
  // TODO remove player from MP
})