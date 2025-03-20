import { AuthenticationForm } from "~/modules/authentication/ui/authentication-form";
import "./login.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData } from "remix-hook-form";
import { AuthenticationFormData } from "~/shared/infrastructure/web/authentication-form-data";
import { authenticator } from "~/shared/services/auth.server";
import type { Route } from "./+types/login-form";

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
			console.log(data);
			break;
		case "register":
			// handle register
			console.log(data);
			break;
		case "sso": {
			// handle sso
			console.log(data);
			const user = await authenticator.authenticate("oauth2", request);
			console.log(user);
			break;
		}
	}
	return;
};

export default function LoginForm() {
	return <AuthenticationForm />;
}
