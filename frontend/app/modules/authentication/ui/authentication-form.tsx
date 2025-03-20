import { zodResolver } from "@hookform/resolvers/zod";
import {
	Anchor,
	Button,
	Center,
	Checkbox,
	Divider,
	Group,
	Paper,
	type PaperProps,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { upperFirst, useToggle } from "@mantine/hooks";
import { Controller } from "react-hook-form";
import { Form } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { AuthenticationFormData } from "~/shared/infrastructure/web/authentication-form-data";

export function AuthenticationForm(props: PaperProps) {
	const [action, toggle] = useToggle(["login", "register"]);
	const resolver = zodResolver(AuthenticationFormData);
	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
	} = useRemixForm<AuthenticationFormData>({
		mode: "onSubmit",
		resolver,
	});

	return (
		<Paper radius="md" p="xl" withBorder {...props}>
			<Text size="lg" fw={500}>
				Welcome to Mantine, {action} with
			</Text>

			<Group grow mb="md" mt="md">
				<Center>
					<Form onSubmit={handleSubmit} method="post" action={"/login-sso"}>
						<Button radius={"xl"} name={"action"} type={"submit"} value={"sso"}>
							SSO
						</Button>
					</Form>
				</Center>
			</Group>

			<Divider label="Or continue with email" labelPosition="center" my="lg" />

			<Form onSubmit={handleSubmit} method="post">
				<Stack>
					{action === "register" && (
						<TextInput
							label="Name"
							placeholder="Your name"
							{...register("name")}
							radius="md"
						/>
					)}

					<TextInput
						required
						label="Email"
						placeholder="hello@mantine.dev"
						{...register("email")}
						radius="md"
					/>

					<PasswordInput
						required
						label="Password"
						placeholder="Your password"
						{...register("password")}
						radius="md"
					/>

					{action === "register" && (
						<Controller
							name={"terms"}
							control={control}
							render={({ field }) => (
								<Checkbox
									label="I accept terms and conditions"
									checked={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					)}
				</Stack>

				<Group justify="space-between" mt="xl">
					<Anchor
						component="button"
						type="button"
						c="dimmed"
						onClick={() => toggle()}
						size="xs"
					>
						{action === "register"
							? "Already have an account? Login"
							: "Don't have an account? Register"}
					</Anchor>
					<Button type="submit" radius="xl" name={"action"} value={action}>
						{upperFirst(action)}
					</Button>
				</Group>
			</Form>
		</Paper>
	);
}
