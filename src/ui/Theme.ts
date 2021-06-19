// blessed doesnt know QUITE how to deal with 16m color modes
// it will always downsample them to 256. which is fine, but
// blessed's algorithm sucks, and comes out with incorrect
// mappings for certain colors. Instead of dealing with that,
// here, we simply tell chalk to always output ansi256 codes
// instead of upsampling them to 16m codes.
import chalk from 'chalk';
chalk.level = 2;

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
  },
  status: {
    idle: StyleFunction,
    self: StyleFunction,
    
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