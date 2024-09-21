import { isArray, parseArray } from './parsers/array';
import { isTuple, parseTuple } from './parsers/tuple';
import { isUnion, parseUnion } from './parsers/union';
import { isLiteral, parseLiteral } from './parsers/literal';
import { hasBrackets, parseBrackets } from './parsers/wrapped';
import { isTypeKeyword, parseTypeKeyword } from './parsers/keyword';

export function parseFromString(type: string, value: unknown): unknown {
	type = type.trim();

	if (isTypeKeyword(type)) {
		return parseTypeKeyword(type, value);
	}

	if (hasBrackets(type)) {
		return parseBrackets(type, value);
	}

	if (isArray(type)) {
		return parseArray(type, value);
	}

	if (isTuple(type)) {
		return parseTuple(type, value);
	}

	if (isUnion(type)) {
		return parseUnion(type, value);
	}

	if (isLiteral(type)) {
		return parseLiteral(type, value);
	}

	throw new Error('Unknown type');
}
