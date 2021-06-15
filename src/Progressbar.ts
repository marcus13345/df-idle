import chalk from "chalk";

export enum ProgressbarStyle {
	indicator = 'indicator',
	progress = 'progress'
}

export function progressbar(completion, width, style: ProgressbarStyle = ProgressbarStyle.indicator) {
	let chalkFn
	if(style === ProgressbarStyle.indicator) {
		if(completion > 0.8) chalkFn = chalk.bgBlue.cyan;
		else if(completion > 0.5) chalkFn = chalk.bgBlue.green;
		else if(completion > 0.2) chalkFn = chalk.bgBlue.yellow;
		else chalkFn = chalk.bgBlue.red;
	} else if(style === ProgressbarStyle.progress) {
		chalkFn = chalk.bgBlue.cyan;
	}
	const chars = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
	let str = '';
	for(let i = 0; i < width; i ++) {
		const remainder = Math.floor(Math.min(Math.max(0, (completion * width) - i), 1) * 8);
		const char = chars[remainder];
		str += chalkFn(char);
	}
	return str;
}