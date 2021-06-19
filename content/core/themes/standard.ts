import { registerTheme } from '@theme';
import chalk from 'chalk'

registerTheme("default", {});

registerTheme("high contrast", {
	selected: chalk.ansi256(250).inverse
});