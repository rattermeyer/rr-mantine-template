import { authenticator } from "~/shared/services/auth.server";
import type { Route } from "./+types/login-sso";
import {logger} from '~/shared/services/logging.server';

export async function action({ request }: Route.ActionArgs) {
	const user = await authenticator.authenticate("oauth2", request);
	logger.debug(user);
	return null;
}
