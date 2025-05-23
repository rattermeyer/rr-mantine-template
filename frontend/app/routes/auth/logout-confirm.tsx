import { LogoutBanner } from "~/components/logout-banner/logout-banner";
import { getUserFromRequest } from "~/shared/services/session.server";
import type { Route } from "./+types/logout-confirm";
import {logger} from '~/shared/services/logging.server';

export async function loader({ request }: Route.LoaderArgs) {
	const account = await getUserFromRequest(request);
	logger.debug(account);
	if (account) {
		throw new Error("You should have been logged out");
	}
}

export default function LogoutConfirm() {
	return <LogoutBanner />;
}
