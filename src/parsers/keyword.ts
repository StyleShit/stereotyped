const typesByKeywords = {
	null: (value: unknown) => value === null,
	string: (value: unknown) => typeof value === 'string',
	number: (value: unknown) => typeof value === 'number',
	boolean: (value: unknown) => typeof value === 'boolean',
	undefined: (value: unknown) => typeof value === 'undefined',
	object: (value: unknown) => typeof value === 'object' && value !== null,
} as const;

export function isTypeKeyword(
	type: string,
): type is keyof typeof typesByKeywords {
	return type in typesByKeywords;
}

export function parseTypeKeyword(
	type: keyof typeof typesByKeywords,
	value: unknown,
) {
	const validator = typesByKeywords[type];

	if (!validator(value)) {
		throw new Error(`Expected type ${type}`);
	}

	return value;
}
