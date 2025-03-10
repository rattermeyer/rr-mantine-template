import { redirect } from "react-router";
import { authenticator } from "~/shared/services/auth.server";
import {
	commitSession,
	getSessionFromRequest,
} from "~/shared/services/session.server";
import type { Route } from "./+types/Callback";

export async function loader({ request }: Route.LoaderArgs) {
	const user = await authenticator.authenticate("oauth2", request);
	const session = await getSessionFromRequest(request);
	console.log(`session id: ${session.id}`);
	if (!user) {
		throw new Error("Failed to authenticate user");
	}
	session.set("user", user);
	const returnTo = session.get("returnTo");
    session.unset("returnTo");
	const headers = new Headers({
		"Set-Cookie": await commitSession(session),
	});
	return redirect(returnTo || "/dashboard", { headers });
}
