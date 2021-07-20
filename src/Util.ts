

export function osrsNumber(x: number): string {
  if(x < 10_000) return '' + x;
  else if (x < 10_000_000) return Math.floor(x / 1000) + 'K';
  else return Math.floor(x / 1_000_000) + 'M';
}