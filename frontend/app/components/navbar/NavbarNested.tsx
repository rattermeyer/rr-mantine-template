import {
	Avatar,
	Group,
	Menu,
	ScrollArea,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { forwardRef } from "react";
import {
	TbAdjustments as IconAdjustments,
	TbCalendarStats as IconCalendarStats,
	TbChevronRight as IconChevronRight,
	TbFileAnalytics as IconFileAnalytics,
	TbGauge as IconGauge,
	TbLock as IconLock,
	TbNotes as IconNotes,
	TbPresentationAnalytics as IconPresentationAnalytics,
} from "react-icons/tb";
import { Form } from "react-router";
import type { Account } from "~/shared/domain/Account.model";
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
import classes from "./NavbarNested.module.css";

const mockdata = [
	{ label: "Dashboard", icon: IconGauge },
	{
		label: "Market news",
		icon: IconNotes,
		initiallyOpened: true,
		links: [
			{ label: "Overview", link: "/" },
			{ label: "Forecasts", link: "/" },
			{ label: "Outlook", link: "/" },
			{ label: "Real time", link: "/" },
		],
	},
	{
		label: "Releases",
		icon: IconCalendarStats,
		links: [
			{ label: "Upcoming releases", link: "/" },
			{ label: "Previous releases", link: "/" },
			{ label: "Releases schedule", link: "/" },
		],
	},
	{ label: "Analytics", icon: IconPresentationAnalytics },
	{ label: "Contracts", icon: IconFileAnalytics },
	{ label: "Settings", icon: IconAdjustments },
	{
		label: "Security",
		icon: IconLock,
		links: [
			{ label: "Enable 2FA", link: "/" },
			{ label: "Change password", link: "/" },
			{ label: "Recovery codes", link: "/" },
		],
	},
];

interface NavbarNestedProps {
	headerPinned?: boolean;
	user: Account;
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	image: string;
	name: string;
	email: string;
	icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
	({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
		<UnstyledButton
			ref={ref}
			style={{
				padding: "var(--mantine-spacing-md)",
				color: "var(--mantine-color-text)",
				borderRadius: "var(--mantine-radius-sm)",
			}}
			{...others}
		>
			<Group>
				<Avatar src={image} radius="xl" />

				<div style={{ flex: 1 }}>
					<Text size="sm" fw={500}>
						{name}
					</Text>

					<Text c="dimmed" size="xs">
						{email}
					</Text>
				</div>

				{icon || <IconChevronRight size={16} />}
			</Group>
		</UnstyledButton>
	),
);

export function NavbarNested({
	headerPinned,
	user = {
		name: "Harriette Spoonlicker",
		email: "henriette.spoonlicker@example.com",
		passwordHash: "",
		emailVerified: false,
		uuid: "00000000-0000-0000-0000-000000000000",
        preferences: {},
        roles: [],
	},
}: NavbarNestedProps) {
	const links = mockdata.map((item) => (
		<LinksGroup {...item} key={item.label} />
	));

	return (
		<nav className={classes.navbar}>
			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>

			<div className={classes.footer}>
				<Menu position={"right-start"} withArrow>
					<Menu.Target>
						<UserButton
							image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
							name={user.name}
							email={user.email}
						/>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Account</Menu.Label>
						<Menu.Item>Profile</Menu.Item>
						<Menu.Item component={Form} method={"POST"} action={"/logout"}>
							<UnstyledButton type={"submit"}>Logout</UnstyledButton>{" "}
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</div>
		</nav>
	);
}
