import { lstatSync } from 'fs';
import { parse, resolve } from 'path';
import walkSync from 'walk-sync';
import { fileURLToPath } from 'url';
import { APPLICATION_NAME } from './Constants.js';

export function osrsNumber(x: number): string {
  if(x < 10_000) return '' + x;
  else if (x < 10_000_000) return Math.floor(x / 1000) + 'K';
  else return Math.floor(x / 1_000_000) + 'M';
}

export async function loadExtensions() {
  console.log(APPLICATION_NAME + ': Loading extensions');
  const extensionsPath = resolve(parse(fileURLToPath(import.meta.url)).dir, '../content');

  const extensions = walkSync(extensionsPath)
    .map(path => [path, resolve(extensionsPath, path)])
    .filter(path => lstatSync(path[1]).isFile())
    .filter(path => parse(path[1]).ext === '.js');

  console.log('found', extensions.length, 'extensions');

  for (const path of extensions) {
    console.log('=== [', path[0], '] ===');
    await import(path[1]);
    console.log();
  }

  console.log('Setup Complete.');
}

// export function