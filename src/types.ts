export type DefObject = {
	[key: string]: string | DefObject;
};

export type Type<T extends DefObject> = (
	value: unknown,
) => Prettify<ParseObject<T>>;

export type ParseObject<T extends DefObject> = {
	[K in keyof T]: Parse<T[K]>;
};

export type Infer<T extends Type<DefObject>> = ReturnType<T>;

export type RemoveReadonly<T> = {
	-readonly [K in keyof T]: RemoveReadonly<T[K]>;
} & {};

type Parse<T> = T extends string
	? ParseFromString<T>
	: T extends DefObject
		? ParseObject<T>
		: T;

type PrimitiveTypesMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	undefined: undefined;
};

export type PrimitiveTypes = PrimitiveTypesMap[keyof PrimitiveTypesMap];

type ParseFromString<_T extends string, T extends string = Trim<_T>> =
	// Simple types
	T extends `${infer P extends keyof PrimitiveTypesMap}`
		? PrimitiveTypesMap[P]
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
						: never;

type Trim<T extends string> = T extends ` ${infer _T}`
	? Trim<_T>
	: T extends `${infer _T} `
		? Trim<_T>
		: T;

type Prettify<T> = {
	[K in keyof T]: Prettify<T[K]>;
} & {};
