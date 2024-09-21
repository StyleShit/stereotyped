import { parseFromString } from '../parse-from-string';

const arrayKeywordRegex = /^Array<(.+)>$/;
const arrayBracketsRegex = /^(.+)\[\]$/;

export function isArray(type: string) {
	return arrayKeywordRegex.test(type) || arrayBracketsRegex.test(type);
}

export function parseArray(type: string, value: unknown): unknown[] {
	if (!Array.isArray(value)) {
		throw new Error('Expected an array');
	}

	const arrayType =
		type.match(arrayKeywordRegex)?.[1] ??
		type.match(arrayBracketsRegex)?.[1] ??
		'';

	return value.map((item) => parseFromString(arrayType, item));
}
