import {createFileSessionStorage} from "@react-router/node";
import {createCookie} from "react-router";
import type {Account} from "~/shared/domain/Account.model";

const sessionCookieName = "__session";
const sessionCookie = createCookie(sessionCookieName, {
	sameSite: "lax", // this is the default, but we set it explicitly here
	//  domain: process.env.COOKIE_DOMAIN, // not needed for localhost
	path: "/", // this is the default, but we set it explicitly here
	httpOnly: true, // for security reasons, make this cookie http only
	secrets: [process.env.COOKIE_SECRET || "s3cr3t"], // replace this with an actual secret
	secure:
		process.env.SECURE === "true" || process.env.NODE_ENV === "production", // enable this in prod only
	// secure: true, // if you have always-on HTTPS, enable this, in all environments
    maxAge: process.env.COOKIE_MAX_AGE ? Number.parseInt(process.env.COOKIE_MAX_AGE) : 60 * 60 // 1 hour
});

export const sessionStorage = createFileSessionStorage({
	dir: "./build/sessions",
	cookie: sessionCookie,
});

export const getSessionFromRequest = async (request: Request) => {
    const cookie = await sessionCookie.parse(request.headers.get("Cookie"));
    return await sessionStorage.getSession(request.headers.get("Cookie"));
};

export const getUserFromRequest = async (
	request: Request,
): Promise<Account | undefined> => {
	const session = await getSessionFromRequest(request);
	const user = session.get("user");
	return user;
};

// define the user model
export type User = {
	name: string;
	token: string;
};

export const { getSession, commitSession, destroySession } = sessionStorage;
