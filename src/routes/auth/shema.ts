import { Static, Type } from '@sinclair/typebox';

export const authTokensSchema = Type.Object({
  accessToken: Type.String(),
});

export const CreateTokensSchema = Type.Object({
  id: Type.String(),
});

export type CreateTokens = Static<typeof CreateTokensSchema>;
export type AuthTokensType = Static<typeof authTokensSchema>;
