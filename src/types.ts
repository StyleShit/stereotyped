export type DefObject = {
	[key: string]: string | DefObject;
};

export type Type<T extends DefObject> = (
	value: unknown,
) => Prettify<ParseObject<T>>;

export type ParseObject<T extends DefObject> = UnionToIntersection<
	{
		[K in keyof T]: K extends `${infer _K}?`
			? {
					-readonly [K2 in _K]?: Parse<T[K]>;
				}
			: {
					-readonly [K2 in K]: Parse<T[K]>;
				};
	}[keyof T]
>;

// See https://stackoverflow.com/a/50375286
type UnionToIntersection<T> = (T extends T ? (t: T) => void : never) extends (
	p: infer P,
) => void
	? P
	: never;

export type Infer<T extends Type<any>> = ReturnType<T>;

export type RemoveReadonly<T> = {
	-readonly [K in keyof T]: RemoveReadonly<T[K]>;
} & {};

type Parse<T> = T extends string
	? ParseFromString<T>
	: T extends DefObject
		? ParseObject<T>
		: T;

type TypesByKeywords = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	undefined: undefined;
	object: object;
};

type ParseFromString<_T extends string, T extends string = Trim<_T>> =
	// Simple types
	T extends `${infer P extends keyof TypesByKeywords}`
		? TypesByKeywords[P]
		: // String literals
			T extends `'${infer P}'` | `"${infer P}"` | `\`${infer P}\``
			? P
			: // Literal types
				T extends `${infer P extends number | boolean}`
				? P
				: // Wrapped with brackets
					T extends `(${infer P})`
					? ParseFromString<P>
					: // Arrays
						T extends `Array<${infer P}>` | `${infer P}[]`
						? Array<ParseFromString<P>>
						: // Tuples
							T extends `[${infer P}]`
							? ParseTupleParts<P>
							: // Unions
								T extends `${infer P1}|${infer P2}`
								? ParseFromString<P1> | ParseFromString<P2>
								: never;

type Trim<T extends string> = T extends ` ${infer _T}`
	? Trim<_T>
	: T extends `${infer _T} `
		? Trim<_T>
		: T;

type ParseTupleParts<T extends string> = T extends ''
	? []
	: T extends `${infer F},${infer R}`
		? [ParseFromString<F>, ...ParseTupleParts<R>]
		: [ParseFromString<T>];

type Prettify<T> = {
	[K in keyof T]: Prettify<T[K]>;
} & {};
