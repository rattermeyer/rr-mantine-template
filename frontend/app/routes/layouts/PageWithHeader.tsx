import { AppShell, AppShellNavbar } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { Outlet } from "react-router";
import { FooterSimple } from "~/components/FooterSimple";
import { HeaderMenu } from "~/components/HeaderMenu";
import { NavbarNested } from "~/components/navbar/NavbarNested";
import { authenticate } from "~/shared/services/auth.server";
import type { Route } from "./+types/PageWithHeader";
import classes from "./PageWithHeader.module.css";

export async function loader({ request }: Route.LoaderArgs) {
    const returnTo = request.url;
	const user = await authenticate(request, returnTo);
	return { user };
}

export default function PageWithHeader({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	const headerHeight = 60;
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
	const headerPinned = useHeadroom({ fixedAt: 2 * headerHeight });

	return (
		<>
			<AppShell
				header={{ height: headerHeight, collapsed: !headerPinned }}
				padding="md"
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
				}}
			>
				<AppShell.Header>
					<HeaderMenu
						mobileOpend={mobileOpened}
						toggleMobile={toggleMobile}
						desktopOpened={desktopOpened}
						toggleDesktop={toggleDesktop}
					/>
				</AppShell.Header>
				<AppShellNavbar>
					<NavbarNested headerPinned={headerPinned} user={user} />
				</AppShellNavbar>
				<AppShell.Main>
					<div className={classes.main}>
						<Outlet />
					</div>
				</AppShell.Main>
				<AppShell.Footer>
					<FooterSimple />
				</AppShell.Footer>
			</AppShell>
		</>
	);
}
