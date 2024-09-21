# StereoTyped

TypeScript 1:1 schema validation, inspired by [ArkType](https://arktype.io).

The goal of this library is to provide a way to write TypeScript-like type definitions that can be used to validate data at runtime.

## Usage

Using `StereoTyped` is very similar to how you would write TypeScript types. To define a type, you can use the `type` function, which takes
an object with the type definition. This function returns a validation function that throws an error when the input data does not match
the type definition. Here is an example:

```typescript
import { type } from 'stereotyped';

const parseUser = type({
  name: 'string',
  age: 'number',
  isCool: 'boolean',
  isAwesome: '"yes" | "no"',
  friends: 'string[]',
  hobbies: '[string, string]',
  address: {
    street: 'string',
    city: 'string',
    zip: 'number',
  },
});

const user = parseUser({
  name: 'John Doe',
  age: 42,
  isCool: true,
  isAwesome: 'yes',
  friends: ['Alice', 'Bob'],
  hobbies: ['coding', 'reading'],
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zip: 12345,
  },
});
```

At this point, the `user` variable is typed as the following:

```typescript
type User = {
  name: string;
  age: number;
  isCool: boolean;
  isAwesome: 'yes' | 'no';
  friends: string[];
  hobbies: [string, string];
  address: {
    street: string;
    city: string;
    zip: number;
  };
};
```

You can infer the parsed type of a schema by using the `Infer` util type from `StereoTyped`:

```typescript
import { type, type Infer } from 'stereotyped';

const schema = type({
  name: 'string',
  age: 'number',
});

type User = Infer<typeof schema>;
// ^? { name: string, age: number }
```

## Supported Types

`StereoTyped` supports the following types & features:

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `object`
- Arrays
- Tuples
- Unions
- Literal types (strings, numbers, booleans)
- Nested objects
- Optional properties
- Required properties
