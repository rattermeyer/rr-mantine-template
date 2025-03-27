import {
	Button,
	Grid,
	SimpleGrid,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { SiReactrouter } from "react-icons/si";
import { TbBrandMantine, TbClipboardText, TbTable } from "react-icons/tb";
import { NavLink } from "react-router";
import classes from "./features-title.module.css";

const features = [
	{
		icon: TbBrandMantine,
		title: "Mantine",
		description:
			"A fully featured React components library. Build fully functional accessible web applications faster than ever – Mantine includes more than 100 customizable components and 50 hooks to cover you in any situation",
	},
	{
		icon: SiReactrouter,
		title: "React Router",
		description:
			"A user‑obsessed, standards‑focused, multi‑strategy router you can deploy anywhere. React Router can be used maximally as your React framework.",
	},
	{
		icon: TbTable,
		title: "Mantine React Table",
		description:
			"Combine TanStack Table's Extensive API With Mantine's Awesome Pre-Built Components! Mantine React Table has most of the features you would expect from a modern table library.",
	},
	{
		icon: TbClipboardText,
		title: "React Hook Form",
		description:
			"Performant, flexible and extensible forms with easy-to-use validation. React Hook Form reduces the amount of code you need to write while removing unnecessary re-renders. ",
	},
];

export function FeaturesTitle() {
	const items = features.map((feature) => (
		<div key={feature.title}>
			<ThemeIcon
				size={44}
				radius="md"
				variant="gradient"
				gradient={{ deg: 133, from: "blue", to: "cyan" }}
				autoContrast
			>
				<feature.icon size={26} strokeWidth={1.5} />
			</ThemeIcon>
			<Text fz="lg" mt="sm" fw={500}>
				{feature.title}
			</Text>
			<Text c="dimmed" fz="sm">
				{feature.description}
			</Text>
		</div>
	));
	const { t } = useTranslation();

	return (
		<div className={classes.wrapper}>
			<Grid gutter={80}>
				<Grid.Col span={{ base: 12, md: 5 }}>
					<Title className={classes.title} order={2}>
						{t("A fully featured react router template")}
					</Title>
					<Text c="dimmed">
						{t("Build")} fully functional accessible web applications faster
						than ever. Using React Router Framework with Mantine Table and
						react-hook-form.
					</Text>

					<Button
						variant="gradient"
						gradient={{ deg: 133, from: "blue", to: "cyan" }}
						size="lg"
						radius="md"
						mt="xl"
						component={NavLink}
						to="/login"
					>
						{t("Login")}
					</Button>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 7 }}>
					<SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
						{items}
					</SimpleGrid>
				</Grid.Col>
			</Grid>
		</div>
	);
}
