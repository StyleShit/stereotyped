import { parseFromString } from '../parse-from-string';

const regex = /^\((.+)\)$/;

export function hasBrackets(type: string) {
	return regex.test(type);
}

export function parseBrackets(type: string, value: unknown) {
	const match = type.match(regex);

	return parseFromString(match?.[1] ?? '', value);
}
