import { FeaturesTitle } from "~/modules/features-title/features-title";
import { Welcome } from "~/modules/welcome/welcome";
import type { Route } from "./+types/home";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return <FeaturesTitle />;
}
