const primitiveTypes = {
	null: (value: unknown) => value === null,
	string: (value: unknown) => typeof value === 'string',
	number: (value: unknown) => typeof value === 'number',
	bigint: (value: unknown) => typeof value === 'bigint',
	boolean: (value: unknown) => typeof value === 'boolean',
	undefined: (value: unknown) => typeof value === 'undefined',
} as const;

export function parseFromString(type: string, value: unknown) {
	type = type.trim();

	if (type in primitiveTypes) {
		return parsePrimitiveType(type as never, value);
	}

	throw new Error('Unknown type');
}

function parsePrimitiveType(type: keyof typeof primitiveTypes, value: unknown) {
	if (!primitiveTypes[type](value)) {
		throw new Error(`Expected type ${type}`);
	}

	return value;
}
