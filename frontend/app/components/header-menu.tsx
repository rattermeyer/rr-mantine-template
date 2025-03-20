import { Burger, Center, Container, Group, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { TbChevronDown as IconChevronDown } from "react-icons/tb";
import { NavLink } from "react-router";
import classes from "./header-menu.module.css";

const links = [
	{ link: "/about", label: "Features" },
	{
		link: "#1",
		label: "Learn",
		links: [
			{ link: "/docs", label: "Documentation" },
			{ link: "/resources", label: "Resources" },
			{ link: "/community", label: "Community" },
			{ link: "/blog", label: "Blog" },
		],
	},
	{ link: "/about", label: "About" },
	{ link: "/pricing", label: "Pricing" },
	{
		link: "#2",
		label: "Support",
		links: [
			{ link: "/faq", label: "FAQ" },
			{ link: "/demo", label: "Book a demo" },
			{ link: "/forums", label: "Forums" },
		],
	},
];

interface HeaderMenuProps {
	mobileOpend?: boolean;
	toggleMobile?: () => void;
	desktopOpened?: boolean;
	toggleDesktop?: () => void;
}

export function HeaderMenu({
	mobileOpend,
	toggleMobile,
	desktopOpened,
	toggleDesktop,
}: HeaderMenuProps) {
	const items = links.map((link) => {
		const menuItems = link.links?.map((item) => (
			<Menu.Item key={item.link}>{item.label}</Menu.Item>
		));

		if (menuItems) {
			return (
				<Menu
					key={link.label}
					trigger="hover"
					transitionProps={{ exitDuration: 0 }}
					withinPortal
				>
					<Menu.Target>
						<a
							href={link.link}
							className={classes.link}
							onClick={(event) => event.preventDefault()}
						>
							<Center>
								<span className={classes.linkLabel}>{link.label}</span>
								<IconChevronDown size={14} strokeWidth={1.5} />
							</Center>
						</a>
					</Menu.Target>
					<Menu.Dropdown>{menuItems}</Menu.Dropdown>
				</Menu>
			);
		}

		return (
			<NavLink
				key={link.label}
				to={link.link}
				className={classes.link}
				onClick={(event) => event.preventDefault()}
			>
				{link.label}
			</NavLink>
		);
	});

	return (
		<header className={classes.header}>
			<Container fluid>
				<div className={classes.inner}>
					<div className={classes.logo}>
						<MantineLogo size={28} />
					</div>
					<Group gap={5} visibleFrom="sm" className={classes.links}>
						{items}
					</Group>
					<div className={classes.burger}>
						<Burger onClick={toggleDesktop} visibleFrom="sm" />
						<Burger onClick={toggleMobile} hiddenFrom="sm" />
					</div>
				</div>
			</Container>
		</header>
	);
}
