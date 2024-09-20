const primitiveTypes = {
	null: (value: unknown) => value === null,
	string: (value: unknown) => typeof value === 'string',
	number: (value: unknown) => typeof value === 'number',
	boolean: (value: unknown) => typeof value === 'boolean',
	undefined: (value: unknown) => typeof value === 'undefined',
} as const;

export function parseFromString(type: string, value: unknown) {
	type = type.trim();

	if (type in primitiveTypes) {
		return parsePrimitiveType(type as never, value);
	}

	const stringLiteral = type.match(/^(['"`])(.+)(\1)$/);

	if (stringLiteral?.[2]) {
		return parseStringLiteral(stringLiteral[2], value);
	}

	if (isPrimitiveLiteral(value)) {
		return parsePrimitiveLiteral(type, value);
	}

	throw new Error('Unknown type');
}

function parsePrimitiveType(type: keyof typeof primitiveTypes, value: unknown) {
	if (!primitiveTypes[type](value)) {
		throw new Error(`Expected type ${type}`);
	}

	return value;
}

function parseStringLiteral(literal: string, value: unknown) {
	if (typeof value !== 'string') {
		throw new Error(
			`Expected value to equal "${literal}", got ${String(value)} (${typeof value})`,
		);
	}

	return value;
}

function isPrimitiveLiteral(value: unknown) {
	return ['number', 'boolean'].includes(typeof value);
}

function parsePrimitiveLiteral(literal: string, value: unknown) {
	let compare: () => boolean = () => false;

	if (/^\d+$/.test(literal)) {
		compare = () => value === Number(literal);
	}

	if (/^(true|false)$/.test(literal)) {
		compare = () => value === Boolean(literal);
	}

	if (!compare()) {
		throw new Error(
			`Expected value to equal ${String(literal)}, got ${String(value)} (${typeof value})`,
		);
	}

	return value;
}
