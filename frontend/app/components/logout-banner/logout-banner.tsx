import { Button, Flex, Image, Text, Title } from "@mantine/core";
import { NavLink } from "react-router";
import image from "./image.svg";
import classes from "./logout-banner.module.css";

export function LogoutBanner() {
	return (
		<div className={classes.wrapper}>
			<div className={classes.body}>
				<Title className={classes.title}>You have been logged out...</Title>
				<Text fw={500} fz="lg" mb={5}>
					We logged you out from the app. If you log in via SSO, you might not
					need to enter your password again.
				</Text>
				<Text fz="sm" c="dimmed">
					Where do you want to go next?
				</Text>

				<div className={classes.controls}>
					<Flex gap="md">
						<Button component={NavLink} to={"/"}>
							Home
						</Button>
						<Button component={NavLink} to={"/login"}>
							Login
						</Button>
					</Flex>
				</div>
			</div>
			<Image src={image} className={classes.image} />
		</div>
	);
}
