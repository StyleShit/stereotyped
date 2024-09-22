import { parseFromString } from '../parse-from-string';

const regex = /^\[(.+)\]$/;

export function isTuple(type: string) {
	return regex.test(type);
}

export function parseTuple(type: string, value: unknown): unknown[] {
	if (!Array.isArray(value)) {
		throw new Error('Expected an array');
	}

	const match = type.match(regex);

	const parts = match?.[1]?.split(',') ?? [];

	if (parts.length !== value.length) {
		throw new Error(
			`Expected ${String(parts.length)} items, got ${String(value.length)}`,
		);
	}

	return parts.map((partType, index) =>
		parseFromString(partType, value[index]),
	);
}
