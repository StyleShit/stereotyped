const regex =
	/(^(['"`])(?<string>.+)\2$)|(?<number>^\d+$)|(?<boolean>^true|false$)/;

export function isLiteral(type: string) {
	return regex.test(type);
}

export function parseLiteral(type: string, value: unknown) {
	const match = type.match(regex);
	let literal: unknown = undefined;

	if (match?.groups?.string) {
		literal = match.groups.string;
	}

	if (match?.groups?.number) {
		literal = Number(match.groups.number);
	}

	if (match?.groups?.boolean) {
		literal = match.groups.boolean === 'true';
	}

	if (value !== literal) {
		throw new Error(
			`Expected value to equal ${String(literal)}, got ${String(value)} (${typeof value})`,
		);
	}

	return value;
}
