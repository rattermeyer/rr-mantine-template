import { Title } from "@mantine/core";
import { Outlet } from "react-router";
import type { Route } from "./+types/layout";

export default function CustomersLayout(_: Route.ComponentProps) {
	return (
		<>
			<Title order={1}>Customers</Title>
			<Outlet />
		</>
	);
}
