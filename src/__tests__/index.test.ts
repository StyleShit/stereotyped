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
		});

		// Act -- Valid type.
		const parsedSchema = parseSchema({
			null: null,
			string: 'John Doe',
			number: 30,
			boolean: true,
			undefined: undefined,
		});

		// Assert.
		expect(parsedSchema).toEqual({
			null: null,
			string: 'John Doe',
			number: 30,
			boolean: true,
			undefined: undefined,
		});

		expectTypeOf(parsedSchema).toEqualTypeOf<{
			null: null;
			string: string;
			number: number;
			boolean: boolean;
			undefined: undefined;
		}>();

		// Act -- Invalid type.
		expect(() =>
			parseSchema({
				null: 'null',
				string: 'John Doe',
				number: 'John Doe',
				boolean: 30,
				undefined: 'undefined',
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
});
