import { Serializable } from 'frigid';

export class SMap<K, V> extends Serializable {
	dict: any = {};
	set(k: K, v: V) {
		if (v === undefined) {
			delete this.dict[k];
		}
		this.dict[k] = v;
	}
	get(k: K): V {
		return this.dict[k];
	}
	has(k: K): boolean {
		return k in this.dict;
	}
}
