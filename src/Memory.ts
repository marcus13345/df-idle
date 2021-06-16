export type Memory = TravelMemory | BirthMemory;

type ProtoMemory = {
	type: string,
	time: {
		stamp: number,
		locale: string
	}
}

export type TravelMemory = ProtoMemory & {
	type: "travel",
	location: string,
}

export type BirthMemory = ProtoMemory & {
	type: "birth",
	location: string,
}

export function stringify(memory: Memory): string {
	switch(memory.type) {
		case "birth": return `I was born at ${memory.time.locale} in ${memory.location}`;
		case "travel": return `I traveled to ${memory.location}.`;
	}
}