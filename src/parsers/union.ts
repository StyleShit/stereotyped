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
		return either(
			() => parseFromString(type1, value),
			() => parseFromString(type2, value),
		);
	} catch {
		throw new Error(`Expected type ${type}`);
	}
}

function either(cb1: () => unknown, cb2: () => unknown) {
	try {
		return cb1();
	} catch {
		return cb2();
	}
}
