import chalk from "chalk";

export function progressbar(completion, width, style = chalk.bold.bgRed.green) {
	const chars = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
	let str = '';
	for(let i = 0; i < width; i ++) {
		const remainder = Math.floor(Math.min(Math.max(0, (completion * width) - i), 1) * 8);
		const char = chars[remainder];
		str += style(char);
	}
	return str;
}