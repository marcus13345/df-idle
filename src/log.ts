import logger from 'logger';

const log: {
	fatal: (...args) => void,
	error: (...args) => void,
	warn: (...args) => void,
	info: (...args) => void,
	debug: (...args) => void,
} = logger.createLogger('debug.log');

(log as any).format = function(level, date, message) {
  return `${date.getTime()} [${level}]${message}`;
};

export default log;