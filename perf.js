console.clear();

const n = 10 ** 8;
// const map = new Map();

console.log('sequential insertion');
for(let run = 0; run < 10; run ++) {
  const arr = [];

  console.time('array');
  for(let i = 0; i < n; i ++) {
    arr.push(133769420)
  }
  console.timeEnd('array')
}