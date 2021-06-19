import chalk from "chalk";

type StyleFunction = (text: string) => string;

export type Theme = {
	header: StyleFunction,
	subheader: StyleFunction,
	normal: StyleFunction,
	selected: StyleFunction,
	hotkey: StyleFunction,
	tab: {
		normal: StyleFunction,
		selected: StyleFunction
	},
	border: {
		focused: string,
		normal: string
	},
	progressBar: {
		indicator: {
			critical: StyleFunction,
			warning: StyleFunction,
			normal: StyleFunction,
			excellent: StyleFunction,
			buckets: [number, number, number]
		},
		normal: StyleFunction
	}
}

export const defaultTheme: Theme = {
	header: chalk.ansi256(255).bold,
	subheader: chalk.ansi256(243).bold,
	normal: chalk.ansi256(243),
	selected: chalk.ansi256(250),
	hotkey: chalk.ansi256(40),
	tab: {
		normal: chalk.ansi256(117),
		selected: chalk.ansi256(117).inverse
	},
	border: {
		focused: '#ffffff',
		normal: '#222222'
	},
	progressBar: {
		indicator: {
			critical: chalk.bgAnsi256(235).ansi256(88),
			warning: chalk.bgAnsi256(235).ansi256(202),
			normal: chalk.bgAnsi256(235).ansi256(70),
			excellent: chalk.bgAnsi256(235).ansi256(87),
			buckets: [.1, .25, .95]
		},
		normal: chalk.bgAnsi256(235).ansi256(243)
	}
}

const debugStyle = chalk.ansi256(213);
export const debugTheme: Theme = {
	header: debugStyle.inverse,
	subheader: debugStyle,
	normal: debugStyle,
	selected: debugStyle.inverse,
	hotkey: debugStyle,
	tab: {
		normal: debugStyle,
		selected: debugStyle.inverse,
	},
	border: {
		focused: '#ff88ff',
		normal: '#ff00ff'
	},
	progressBar: defaultTheme.progressBar
}

export function getTheme(): Theme {
	return defaultTheme;
}