import { Static, Type } from '@sinclair/typebox';

export const ParamsSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 }),
});

export const BodySchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
});

export type CreateSchema = Static<typeof BodySchema>;

export type ParamsType = Static<typeof ParamsSchema>;
