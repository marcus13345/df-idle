import { registerTheme } from '@themes';
import chalk from 'chalk'

registerTheme("default", {});

registerTheme("high contrast", {
	bright: chalk.ansi256(250).inverse
});