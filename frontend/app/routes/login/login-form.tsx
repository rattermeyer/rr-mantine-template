import { AuthenticationForm } from "~/modules/authentication/ui/authentication-form";
import "./login.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData } from "remix-hook-form";
import { AuthenticationFormData } from "~/shared/infrastructure/web/authentication-form-data";
import { authenticator } from "~/shared/services/auth.server";
import type { Route } from "./+types/login-form";
import { logger } from "~/shared/services/logging.server";

const resolver = zodResolver(AuthenticationFormData);

export const action = async ({ request }: Route.ActionArgs) => {
	const {
		errors,
		data,
		receivedValues: defaultValues,
	} = await getValidatedFormData<AuthenticationFormData>(request, resolver);
	if (errors) {
		return { errors, defaultValues };
	}
	switch (data.action) {
		case "login":
			// handle login
			logger.debug(data);
			break;
		case "register":
			// handle register
			logger.debug(data);
			break;
		case "sso": {
			// handle sso
			logger.debug(data);
			const user = await authenticator.authenticate("oauth2", request);
			logger.debug(user);
			break;
		}
	}
	return;
};

export default function LoginForm() {
	return <AuthenticationForm />;
}
