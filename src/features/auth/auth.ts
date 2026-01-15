import { context } from '@conf/ctx';
import { Elysia, t, type Static } from 'elysia';
import {Compile} from 'typebox/compile';
import {jwtDecode} from 'jwt-decode';

const SocialSigninPayload = t.Object({
  provider: t.String(),
  token: t.String()
});
const GoogleTokenPayload = t.Object({
  iss: t.String(), // The JWT's issuer
  nbf:  t.Number(),
  aud: t.String(), // Your server's client ID
  sub: t.String(), // The unique ID of the user's Google Account
  hd: t.String(), // If present, the host domain of the user's GSuite email address
  email: t.String(), // The user's email address
  email_verified: t.Boolean(), // true, if Google has verified the email address
  azp: t.String(),
  name: t.String(),
  picture: t.Optional(t.String()),
  given_name: t.String(),
  family_name: t.String(),
  iat: t.Number(), // Unix timestamp of the assertion's creation time
  exp: t.Number(), // Unix timestamp of the assertion's expiration time
  jti: t.String()
})

export const auth = new Elysia({name: "@app/auth", prefix:'auth'})
  .use(context)
  .post('/', ctx => {
    const {provider, token} = ctx.body;
    const jwtValidator = Compile(GoogleTokenPayload);
    const decodedToken = jwtDecode(token);
    const jwtPayload = jwtValidator.Parse(decodedToken);

  }, {
    body: SocialSigninPayload
  })