// === [ netowkring ] ===
export const MDNS_TYPE = 'hdn';

// === [ IPC DEV SERVER ] ===
export const IPC_CLIENT_APPSPACE = MDNS_TYPE + '.';
export const IPC_CLIENT_CONNECT_NAME = 'dev';
export const IPC_PATH = '/tmp/' + IPC_CLIENT_APPSPACE + IPC_CLIENT_CONNECT_NAME;

export const IPC_QUIT_EVENT = 'app.quit';
export const IPC_RESTART_EVENT = 'app.restart';
export const IPC_REQUEST_RESTART = 'app.request-restart';

// === [ app info ] ===
export const APPLICATION_NAME = 'Hadean'