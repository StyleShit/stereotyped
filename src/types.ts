export type DefObject = Record<string, unknown>;

export type Type<T extends DefObject> = (
	value: unknown,
) => Prettify<ParseObject<T>>;

export type ParseObject<T extends DefObject> = {
	[K in keyof T]: T[K] extends string ? ParseFromString<T[K]> : never;
};

export type Infer<T extends Type<DefObject>> = ReturnType<T>;

export type RemoveReadonly<T> = {
	-readonly [K in keyof T]: RemoveReadonly<T[K]>;
} & {};

type PrimitiveTypes = {
	string: string;
	number: number;
	bigint: bigint;
	boolean: boolean;
	null: null;
	undefined: undefined;
};

type ParseFromString<_T extends string, T extends string = Trim<_T>> =
	// Simple types
	T extends `${infer P extends keyof PrimitiveTypes}`
		? PrimitiveTypes[P]
		: never;

type Trim<T extends string> = T extends ` ${infer _T}`
	? Trim<_T>
	: T extends `${infer _T} `
		? Trim<_T>
		: T;

type Prettify<T> = {
	[K in keyof T]: Prettify<T[K]>;
} & {};
