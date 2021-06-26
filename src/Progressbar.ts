import chalk from "chalk";
import { getTheme } from "@themes";

export enum ProgressbarStyle {
	indicator = 'indicator',
	progress = 'progress'
}

export const barCache: Map<string, string> = new Map();

export function progressbar(completion: number, width: number, style: ProgressbarStyle = ProgressbarStyle.indicator) {
	const cacheKey = `${Math.round(completion * width * 8)}-${width}-${style}`;
	if(barCache.has(cacheKey)) {
		stats.cacheHits ++;
		return barCache.get(cacheKey);
	}
	let chalkFn
	if(style === ProgressbarStyle.indicator) {
		if(completion > getTheme().progressBar.indicator.buckets[2]) chalkFn = getTheme().progressBar.indicator.excellent;
		else if(completion > getTheme().progressBar.indicator.buckets[1]) chalkFn = getTheme().progressBar.indicator.normal;
		else if(completion > getTheme().progressBar.indicator.buckets[0]) chalkFn = getTheme().progressBar.indicator.warning;
		else chalkFn = getTheme().progressBar.indicator.critical;
	} else if(style === ProgressbarStyle.progress) {
		chalkFn = getTheme().progressBar.normal;
	}
	
	const chars = [
		'\u0020',
		'\u258f',
		'\u258e',
		'\u258d',
		'\u258c',
		'\u258b',
		'\u258a',
		'\u2589',
		'\u2588'
	];

	let str = '';
	for(let i = 0; i < width; i ++) {
		const remainder = Math.floor(Math.min(Math.max(0, (completion * width) - i), 1) * 8);
		const char = chars[remainder];
		str += chalkFn(char);
	}
	stats.cacheMisses ++;
	barCache.set(cacheKey, str);
	return str;
}

export const stats = {
	cacheHits: 0,
	cacheMisses: 0
}