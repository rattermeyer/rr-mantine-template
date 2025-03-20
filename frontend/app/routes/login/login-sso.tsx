import { authenticator } from "~/shared/services/auth.server";
import type { Route } from "./+types/login-sso";

export async function action({ request }: Route.ActionArgs) {
	const user = await authenticator.authenticate("oauth2", request);
	console.log(user);
	return null;
}
