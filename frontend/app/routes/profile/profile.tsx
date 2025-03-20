import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Select, Stack } from "@mantine/core";
import type { Kysely } from "kysely";
import { Controller } from "react-hook-form";
import { Form, data, redirect } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { container } from "~/inversify-config.server";
import type { AccountRepository } from "~/modules/authentication/domain/account.repository";
import type {
	DB,
	Preference,
} from "~/shared/infrastructure/db/model/kysely/tables";
import { authenticate } from "~/shared/services/auth.server";
import type { Route } from "./+types/profile";

const accountRepository = container.get<
	(kysely?: Kysely<DB>) => AccountRepository
>("Factory<AccountRepository>")();

const schema = z.object({
	lang: z.enum(["en", "de"]),
});

const resolver = zodResolver(schema);

export async function loader({ request }: Route.LoaderArgs) {
	const account = await authenticate(request, "/profile");
	account.preferences =
		(await accountRepository.findPreferencesByUuid(
			account.uuid,
			"general",
			"lang",
		)) || [];
	return { account };
}

export async function action({ request }: Route.ActionArgs) {
	const account = await authenticate(request);
	const {
		errors,
		receivedValues: defaultValues,
		data: formData,
	} = await getValidatedFormData(request, resolver);
	if (errors) {
		return data({ errors, defaultValues: formData }, { status: 400 });
	}
	await accountRepository.updatePreference(
		account.uuid,
		"general",
		"lang",
		formData.lang,
	);
	return redirect("/profile");
}

export default function ProfileRoute({ loaderData }: Route.ComponentProps) {
	const { account } = loaderData;
	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
	} = useRemixForm({
		resolver,
		defaultValues: account.preferences,
	});
	const lang =
		account.preferences.find((p: Preference) => p.key === "lang")?.value ||
		"en";
	return (
		<div>
			<h1>Profile</h1>
			<p>Email: {account.email}</p>
			<p>Langauge: {lang}</p>
			<Container size={"md"}>
				<Form onSubmit={handleSubmit} method={"post"}>
					<Stack gap={"md"}>
						<Controller
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									data={[
										{
											value: "en",
											label: "English",
										},
										{
											value: "de",
											label: "German",
										},
									]}
									placeholder={"Select language"}
									defaultValue={lang}
								/>
							)}
							name={"lang"}
						/>
						<Button type={"submit"}>Save</Button>
					</Stack>
				</Form>
			</Container>
		</div>
	);
}
