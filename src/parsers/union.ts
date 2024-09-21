import { parseFromString } from '../parse-from-string';

const regex = /^(.+)\|(.+)$/;

export function isUnion(type: string) {
	return regex.test(type);
}

export function parseUnion(type: string, value: unknown): unknown {
	const match = type.match(regex);

	const type1 = match?.[1] ?? '';
	const type2 = match?.[2] ?? '';

	try {
		return parseFromString(type1, value);
	} catch {
		return parseFromString(type2, value);
	}
}
