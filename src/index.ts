import { parseFromString } from './parse-from-string';
import type { Type, DefObject, RemoveReadonly } from './types';

export type { DefObject, Infer, Type } from './types';

export function type<const T extends DefObject>(
	definition: T,
): Type<RemoveReadonly<T>> {
	return (value) => {
		if (!value || typeof value !== 'object') {
			throw new Error('Expected an object to parse');
		}

		const parsed: Record<string, unknown> = {};

		Object.entries(definition).forEach(([key, type]) => {
			if (!(key in value)) {
				throw new Error(`Missing key ${key}`);
			}

			const propValue = value[key as never];

			if (typeof type === 'string') {
				parsed[key] = parseFromString(type, propValue);

				return;
			}

			throw new Error('Unknown type');
		});

		return parsed as never;
	};
}
