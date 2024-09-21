import { describe, expect, expectTypeOf, it } from 'vitest';
import { type } from '..';

describe('type', () => {
	it('should throw for non objects', () => {
		// Arrange.
		const user = type({
			name: 'string',
			age: 'number',
		});

		// Act.
		expect(() => user('John Doe')).toThrow('Expected an object to parse');
	});

	it('should throw for missing keys', () => {
		// Arrange.
		const user = type({
			name: 'string',
			age: 'number',
		});

		// Act.
		expect(() =>
			user({
				name: 'John Doe',
			}),
		).toThrow('Missing key age');
	});

	it('should throw for unknown types', () => {
		// Arrange.
		const user = type({
			name: 'unknown-type',
		});

		// Act.
		expect(() =>
			user({
				name: 'John Doe',
			}),
		).toThrow('Unknown type');
	});

	it('should parse simple types', () => {
		// Arrange.
		const parseSchema = type({
			null: 'null',
			string: 'string',
			number: 'number',
			boolean: 'boolean',
			undefined: 'undefined',
			object: 'object',
		});

		// Act -- Valid type.
		const parsedSchema = parseSchema({
			null: null,
			string: 'John Doe',
			number: 30,
			boolean: true,
			undefined: undefined,
			object: {
				key: 'value',
			},
		});

		// Assert.
		expect(parsedSchema).toEqual({
			null: null,
			string: 'John Doe',
			number: 30,
			boolean: true,
			undefined: undefined,
			object: {
				key: 'value',
			},
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			null: null;
			string: string;
			number: number;
			boolean: boolean;
			undefined: undefined;
			object: object;
		}>();

		// Act -- Invalid type.
		expect(() =>
			parseSchema({
				null: 'null',
				string: 'John Doe',
				number: 'John Doe',
				boolean: 30,
				undefined: 'undefined',
				object: 'object',
			}),
		).toThrow('Expected type null');
	});

	it('should trim spaces in schema', () => {
		// Arrange.
		const parseSchema = type({
			string: ' string ',
		});

		// Act.
		const parsedSchema = parseSchema({
			string: 'John Doe',
		});

		// Assert.
		expect(parsedSchema).toEqual({
			string: 'John Doe',
		});
	});

	it('should parse literals', () => {
		// Arrange.
		const parseSchema = type({
			string: '"John Doe"',
			number: '30',
			boolean: 'true',
		});

		// Act -- Valid type.
		const parsedSchema = parseSchema({
			string: 'John Doe',
			number: 30,
			boolean: true,
		});

		// Assert.
		expect(parsedSchema).toEqual({
			string: 'John Doe',
			number: 30,
			boolean: true,
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			string: 'John Doe';
			number: 30;
			boolean: true;
		}>();

		// Act -- Invalid type.
		expect(() =>
			parseSchema({
				string: 'John Doe',
				number: 30,
				boolean: false,
			}),
		).toThrow('Expected value to equal true');
	});

	it('should parse types wrapped with brackets', () => {
		// Arrange.
		const parseSchema = type({
			string: '(string)',
		});

		// Act.
		const parsedSchema = parseSchema({
			string: 'John Doe',
		});

		// Assert.
		expect(parsedSchema).toEqual({
			string: 'John Doe',
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			string: string;
		}>();
	});

	it('should parse arrays', () => {
		// Arrange.
		const parseSchema = type({
			strings: 'Array<string>',
			numbers: 'number[]',
			booleans: '(boolean)[]',
		});

		// Act -- Valid type.
		const parsedSchema = parseSchema({
			strings: ['John Doe'],
			numbers: [30],
			booleans: [true],
		});

		// Assert.
		expect(parsedSchema).toEqual({
			strings: ['John Doe'],
			numbers: [30],
			booleans: [true],
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			strings: string[];
			numbers: number[];
			booleans: boolean[];
		}>();

		// Act -- Invalid type.
		expect(() =>
			parseSchema({
				strings: ['string', 30],
				numbers: ['John Doe'],
				booleans: [30],
			}),
		).toThrow('Expected type string');
	});

	it('should parse tuples', () => {
		// Arrange.
		const parseSchema = type({
			tuple: '[string, number, boolean]',
		});

		// Act - Valid type.
		const parsedSchema = parseSchema({
			tuple: ['John Doe', 30, true],
		});

		// Assert.
		expect(parsedSchema).toEqual({
			tuple: ['John Doe', 30, true],
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			tuple: [string, number, boolean];
		}>();

		// Act - Invalid type.
		expect(() =>
			parseSchema({
				tuple: ['John Doe', 30, 'true'],
			}),
		).toThrow('Expected type boolean');

		// Act - Invalid length.
		expect(() =>
			parseSchema({
				tuple: ['John Doe', 30],
			}),
		).toThrow('Expected 3 items, got 2');
	});

	it('should parse nested objects', () => {
		// Arrange.
		const parseSchema = type({
			type: 'string',
			user: {
				name: 'string',
				age: 'number',
			},
		});

		// Act.
		const parsedSchema = parseSchema({
			type: 'user',
			user: {
				name: 'John Doe',
				age: 30,
			},
		});

		// Assert.
		expect(parsedSchema).toEqual({
			type: 'user',
			user: {
				name: 'John Doe',
				age: 30,
			},
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			type: string;
			user: {
				name: string;
				age: number;
			};
		}>();
	});

	it('should parse unions', () => {
		// Arrange.
		const parseSchema = type({
			type: 'string|number',
			array: 'Array<string | number>',
			literal: '"john" | 30',
		});

		// Act - Valid type 1.
		const parsedSchema1 = parseSchema({
			type: 'John Doe',
			array: ['John Doe', 30],
			literal: 'john',
		});

		// Assert.
		expect(parsedSchema1).toEqual({
			type: 'John Doe',
			array: ['John Doe', 30],
			literal: 'john',
		});

		expectTypeOf(parsedSchema1).toEqualTypeOf<{
			type: string | number;
			array: Array<string | number>;
			literal: 'john' | 30;
		}>();

		// Act - Valid type 2.
		const parsedSchema2 = parseSchema({
			type: 30,
			array: [20, 30],
			literal: 30,
		});

		// Assert.
		expect(parsedSchema2).toEqual({
			type: 30,
			array: [20, 30],
			literal: 30,
		});

		// Act - Invalid type.
		expect(() =>
			parseSchema({
				type: true,
				array: ['John Doe', 30],
				literal: 'john',
			}),
		).toThrow('Expected type number');
	});

	it('should parse optional keys', () => {
		// Arrange.
		const parseSchema = type({
			name: 'string',
			age: 'number',
			'optional?': 'string',
		});

		// Act - Valid type 1.
		const parsedSchema1 = parseSchema({
			name: 'John Doe',
			age: 30,
		});

		// Assert.
		expect(parsedSchema1).toEqual({
			name: 'John Doe',
			age: 30,
		});

		expectTypeOf(parsedSchema1).toEqualTypeOf<{
			name: string;
			age: number;
			optional?: string;
		}>();

		// Act - Valid type 2.
		const parsedSchema2 = parseSchema({
			name: 'John Doe',
			age: 30,
			optional: undefined,
		});

		// Assert.
		expect(parsedSchema2).toEqual({
			name: 'John Doe',
			age: 30,
		});

		// Act - Valid type 3.
		const parsedSchema3 = parseSchema({
			name: 'John Doe',
			age: 30,
			optional: 'optional',
		});

		// Assert.
		expect(parsedSchema3).toEqual({
			name: 'John Doe',
			age: 30,
			optional: 'optional',
		});

		// Act - Invalid type.
		expect(() =>
			parseSchema({
				name: 'John Doe',
				age: 30,
				optional: 30,
			}),
		).toThrow('Expected type string');
	});
});
