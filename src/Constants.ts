import { parse, resolve } from 'path';
import { fileURLToPath } from 'url';

// === [ app info ] ===
export const APPLICATION_NAME = 'Hadean';
export const INSTALL_LOCATION = resolve(parse(fileURLToPath(import.meta.url)).dir);

// === [ netowkring ] ===
export const MDNS_TYPE = 'hdn';

// === [ IPC DEV SERVER ] ===
export const IPC_CLIENT_CONNECT_NAME = 'dev';
export const IPC_CLIENT_APPSPACE = MDNS_TYPE + '.';
export const IPC_PATH = '/tmp/' + IPC_CLIENT_APPSPACE + IPC_CLIENT_CONNECT_NAME;

export const IPC_QUIT_EVENT = 'app.quit';
export const IPC_RESTART_EVENT = 'app.restart';
export const IPC_REQUEST_RESTART = 'app.request-restart';

// === [ styling ] ===
export const FONT_FAMILY = 'MxPlus IBM VGA 8x14'
export const FONT_LOCATION = resolve(
  INSTALL_LOCATION,
  'assets/font/bitmap',
  FONT_FAMILY.replace(' ', '_') + '.ttf'
);
export const FONT_SIZE = 12;