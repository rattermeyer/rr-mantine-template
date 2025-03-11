import type {OAuth2Tokens} from "arctic";
import {jwtDecode, type JwtPayload} from "jwt-decode";
import {redirect} from "react-router";
import {Authenticator} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
import {CodeChallengeMethod, OAuth2Strategy} from "remix-auth-oauth2";
import {v7 as uuidv7} from "uuid";
import {zfd} from "zod-form-data";
import {container} from "~/InversifyConfig.server";
import {AccountService} from "~/pages/AuthenticationForm/domain/Account.service";
import type {Account, CreateAccount} from "~/shared/domain/Account.model";
import {AuthenticationFormData} from "~/shared/infrastructure/web/AuthenticationFormData";
import {commitSession, getSessionFromRequest,} from "~/shared/services/session.server";

const accountService = container.get<AccountService>(AccountService.type);

export const authenticator = new Authenticator<Account>();
authenticator.use(
    new FormStrategy(async ({form}) => {
        const schema = zfd.formData(AuthenticationFormData);
        const {email = "", password = ""} = schema.parse(form);
        const account = await accountService.verifyPassword(email, password);
        if (!account) {
            throw new Error("Invalid email or password");
        }
        return account;
    }),
);
authenticator.use(
    new OAuth2Strategy(
        {
            cookie: "oauth2", // Optional, can also be an object with more options

            clientId: process.env.CLIENT_ID || "client-id-unset",
            clientSecret: process.env.CLIENT_SECRET || "client-secret-unset",

            authorizationEndpoint:
                process.env.AUTHORIZATION_ENDPOINT ||
                "https://provider.com/oauth2/authorize",
            tokenEndpoint:
                process.env.TOKEN_ENDPOINT || "https://provider.com/oauth2/token",
            redirectURI:
                process.env.REDIRECT_URI || "http://localhost:3000/oauth2/callback",

            tokenRevocationEndpoint: "https://provider.com/oauth2/revoke", // optional

            scopes: ["openid", "email", "profile", "groups"], // optional
            codeChallengeMethod: CodeChallengeMethod.S256, // optional
        },
        async ({tokens, request}) => {
            // here you can use the params above to get the user and return it
            // what you do inside this and how you find the user is up to you
            const user = await getUser(tokens, request);
            return user;
        },
    ),
);

type DexPayload = JwtPayload & {
    email?: string;
    groups?: string[];
    name?: string;
    preferred_username?: string;
    displayName?: string;
};

async function getUser(
    tokens: OAuth2Tokens,
    request: Request,
): Promise<Account> {
    // here you can use the tokens to get the user and return it
    // what you do inside this and how you find the user is up to you
    const idTokenDecoded = jwtDecode<DexPayload>(tokens.idToken());
    if (!idTokenDecoded) {
        throw new Error("Invalid id token");
    }
    const account = await accountService.getOrCreateAccount({
        uuid: uuidv7(),
        email: idTokenDecoded.email || "",
        name: idTokenDecoded.name || "",
        roles: idTokenDecoded.groups || [],
    });
    if (!account) {
        throw new Error("Failed to get or create account");
    }
    return account;
}

export async function authenticate(request: Request, returnTo?: string) {
    const session = await getSessionFromRequest(request);
    const user = await session.get("user");
    if (user) return user;
    if (returnTo) session.set("returnTo", returnTo);
    throw redirect("/login", {
        headers: {"Set-Cookie": await commitSession(session)},
    });
}
