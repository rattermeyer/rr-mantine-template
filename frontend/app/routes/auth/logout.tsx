import { redirect, useFetcher } from "react-router";
import {
	destroySession,
	getSessionFromRequest,
} from "~/shared/services/session.server";
import type { Route } from "./+types/logout";

export async function loader() {}
export async function action({ request }: Route.ActionArgs) {
	const session = await getSessionFromRequest(request);
	return redirect("/logout-confirm", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
}
